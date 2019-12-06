const { retrieveShoesData, createNewEntry, getUser, pool } = require('../../postgresDB/index.js');
const { parseStreamAndWriteDataObj } = require('../serverUtils.js')
const { log } = require('../utils.js')
const fs = require('fs');
const JSONStream = require('JSONStream');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { validationResult } = require('express-validator');

module.exports = {
  handleCreateNewEntry: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    if (req.body) {
      const response = await createNewEntry(req.body.shoesName, req.body.shoesSize, req.body.trueToSizeCalculation)
      if (response.length === 1) {
        await res.send(response)
      } else {
        res.statusMessage = await response;
        await res.status(400).end(response);
      }
    }
  },

  checkPasswordMiddleware: async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    if (req.body.username) {
      const response = await getUser(req.body.username);
      if (response.rows.length === 0) {
        res.statusMessage = "User doesn't exist";
        await res.status(401).end("User doesn't exist");
      } else {
        const hash = await bcrypt.compare(req.body.password, response.rows[0].password)
        if (hash === true) {
          await next()
        }
        if (hash === false) {
          res.statusMessage = 'Wrong Password';
          await res.status(401).end('Wrong Password');
        }
      }
    }
  },

  checkPasswordMiddleware2: async (req, res, next) => {
    //validate if username or password is empty
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    if (req.query.username) {
      const response = await getUser(req.query.username);
      if (response.rows.length === 0) {
        res.statusMessage = "User doesn't exist";
        await res.status(401).end("User doesn't exist");
      } else {
        const hash = await bcrypt.compare(req.query.password, response.rows[0].password)
        if (hash === true) {
          await next()
        }
        if (hash === false) {
          res.statusMessage = 'Wrong Password';
          await res.status(401).end('Wrong Password');
        }
      }
    }
  },

  handleTrueToSizeCalculation: (req, res) => {
    if (req.query) {
      retrieveShoesData(req.query.shoesname, data => {
        if (data.length > 0) res.send(data);
        else {
          res.statusMessage = "shoes entry doesn't exist";
          res.status(404).end("shoes entry doesn't exist");
        }
      })
    }
  },

  handleTrueToSizeCalculationURL: (req, res) => {
    if (req.params.shoesname) {
      retrieveShoesData(req.params.shoesname, data => {
        if (data.length > 0) res.send(data);
        else {
          res.statusMessage = "shoes entry doesn't exist";
          res.status(404).end("shoes entry doesn't exist");
        }
      })
    }
  },

  serveFakeStream: (req, res) => {
    const stream = fs.createReadStream(`./sample_data/shoes_size1.json`, { encoding: 'utf8' });
    stream.pipe(res);
    stream.on('end', () => {
      log.info('Finish writing stream to client')
      res.end()
    })
  },

  retrieveParseAndInsertToPostgres: async (req, res) => {
    //validate if query 'url' is correctly provided:
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    /* IN REAL PRODUCTION, I WOULD ASSUME WE EITHER DOWNLOAD THE LARGE JSON FILES OR MAKE
    HTTP REQUESTS AND THEN PARSE THEM TO COMPUTE AVG SHOES SIZE USING A STREAM LIKE THIS:
    */
    const shoes = {}
    const JSONparser = await JSONStream.parse('*');
    await axios({
      method: 'GET',
      url: req.query.url,
      responseType: 'stream' //create a readstream and pipe
    })
      .then(function (response) {
        response.data.pipe(JSONparser) //parse JSON stream by line
        JSONparser.on('data', (obj) => {
          //create an obj of data to be inserted into postgres
          parseStreamAndWriteDataObj(shoes, obj)
        });

        JSONparser.on('end', async () => {
          log.info('READING STREAM FROM API ENDED');
          //Insert to database
          for (let key in shoes) {  //Insert to database
            await createNewEntry(key, shoes[key].shoesSize, shoes[key].trueToSizeCalculation)
          }
          await res.send("FINISHED INSERTING NEW DATA TO POSTGRES")
        })

        JSONparser.on('error', (err) => {
          log.error('ERROR READING STREAM', err);
          res.statusMessage = 'FAILED CREATING NEW DATA IN SERVER';
          res.status(500).end('FAILED CREATING NEW DATA IN SERVER');
        })
      })
      .catch(err => { log.error(err) })
  },
}