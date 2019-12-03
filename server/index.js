require('newrelic');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { log } = require('./utils.js');

const bcrypt = require('bcryptjs');
const { retrieveShoesData, createNewEntry,getUser, pool } = require('../postgresDB/index.js');
const dotenv = require('dotenv');
dotenv.config();

//import PORT variable from .env file. This file is ignored from github commit and
//instruction to set up .env file will be given to team members
//In real production, it's better to use a secret system management such as the AWS System Manager.
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
// const redis = require('redis');

// const clientRedis = redis.createClient(process.env.REDIS_URL);

// clientRedis.on('connect', function() {
//     log.info('Redis client connected');
// });

// clientRedis.on('error', function (err) {
//     log.info('Something went wrong ' + err);
// });

app.get('/', (req,res)=> {
  res.send(`Please go to localhost:${PORT}/trueToSizeCalculation to get True To Size Calculation`)
})

app.get('/trueToSizeCalculation', (req,res)=> {
  if (req.query) {
    retrieveShoesData(req.query.shoesname, data => {
      if (data.length>0) res.send(data)
      res.status(401).end("shoes entry doesn't exist")
    })
  }
})

app.get('/trueToSizeCalculation/:shoesname', (req,res)=> {
  if (req.params.shoesname) {
    retrieveShoesData(req.params.shoesname, data => {
      if (data.length>0) res.send(data);
      res.status(401).end("shoes entry doesn't exist")
    })
  }
})

//Simple authentication middleware. In real production, I could use Passport for authentication handler
//and express-session to persists login session.
//Unfortunately if we only make http request to login, it will refresh sessionID every time because no cookies
//was passed and stored from browser
app.post('/createNewEntry', async (req,res,next)=> {
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
})

app.post('/createNewEntry', async (req,res)=> {
    if (req.body) {
      const response = await createNewEntry(req.body.shoesName, req.body.shoesSize, req.body.trueToSizeCalculation)
      if (response.length===1) {
        await res.send(response)
      }
      await res.status(401).end(response)
    }
})


module.exports = app.listen(PORT, ()=> {
  log.info(`Now accepting connection on port ${PORT}`)
})

