const { retrieveShoesData, createNewEntry, getUser, pool } = require('../../postgresDB/index.js');
const fs = require('fs');
const JSONStream = require('JSONStream');
const bcrypt = require('bcryptjs');

module.exports = {
  handleCreateNewEntry: async (req, res) => {
    if (req.body) {
      const response = await createNewEntry(req.body.shoesName, req.body.shoesSize, req.body.trueToSizeCalculation)
      if (response.length === 1) {
        await res.send(response)
      }
      await res.status(401).end(response)
    }
  },

  checkPasswordMiddleware: async (req,res,next)=> {
    if(req.body.username) {
      const response = await getUser(req.body.username);
      if (response.rows.length===0) {
        await res.status(401).end("User doesn't exist");
      } else {
        const hash = await bcrypt.compare(req.body.password, response.rows[0].password)
        if (hash === true) {
          await next()
        }
        if (hash === false) {
          await res.status(400).end('Wrong Password')
        }
      }
    }
  },

  handleTrueToSizeCalculation: (req, res) => {
    if (req.query) {
      retrieveShoesData(req.query.shoesname, data => {
        if (data.length > 0) res.send(data)
        res.status(401).end("shoes entry doesn't exist")
      })
    }
  },

  handleTrueToSizeCalculationURL: (req,res)=> {
    if (req.params.shoesname) {
      retrieveShoesData(req.params.shoesname, data => {
        if (data.length>0) res.send(data);
        res.status(401).end("shoes entry doesn't exist")
      })
    }
  },

  serveFakeStream: (req, res) => {
    const stream = fs.createReadStream(`./sample_data/shoes_size1.json`, { encoding: 'utf8' });
    stream.pipe(res);
    stream.on('end', () => {
      log.info('Finish writing stream to client')
    })
  },

  retrieveParseAndInsertToPostgres: async (req,res)=>{
    /* IN REAL PRODUCTION, I WOULD ASSUME WE EITHER DOWNLOAD THE LARGE JSON FILES OR MAKE
    HTTP REQUESTS AND THEN PARSE THEM TO COMPUTE AVG SHOES SIZE USING SOMETHING STREAM LIKE THIS:
    */
    const shoes = {}
    const JSONparser = await JSONStream.parse('*');
    await axios({
      method: 'GET',
      url: req.query.url,
      responseType: 'stream'
    })
    .then(function(response) {
      response.data.pipe(JSONparser) //parse JSON stream by line
      JSONparser.on('data', (obj) => {
        parseStreamAndWriteDataObj(shoes,obj)
      });

      JSONparser.on('end', async ()=>{
        log.info('READING STREAM FROM API ENDED');
      })

      JSONparser.on('error',(err)=>{
        log.error('ERROR', err)
      })
    })
    .catch(err=>{console.log(err)})

    //Insert to database
    for (let key in shoes) {
      await createNewEntry(key, shoes[key].shoesSize,shoes[key].trueToSizeCalculation)
    }
    await res.send('Finished Inserting New Data To Postgres')
  },


}