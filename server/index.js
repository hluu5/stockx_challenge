require('newrelic');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { retrieveShoesData } = require('../postgresDB/index.js');
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//import PORT variable from .env file. This file is ignored from github commit and
//instruction to set up .env file will be given to team members
//In real production, it's better to use a secret system management such as the AWS System Manager.
const PORT = process.env.PORT;

app.get('/', (req,res)=> {
  res.send(`Please go to localhost:${PORT}/trueToSizeCalculation to get True To Size Calculation`)
})

app.get('/trueToSizeCalculation', (req,res)=> {
  if (req.query) {
    retrieveShoesData(req.query.shoesname, data => {
      if (data.length>0) res.send(data);
      res.status(401)
      res.send("shoes entry doesn't exist")
    })
  }
})

app.get('/trueToSizeCalculation/:shoesname', (req,res)=> {
  if (req.params.shoesname) {
    retrieveShoesData(req.params.shoesname, data => {
      if (data.length>0) res.send(data);
      res.status(401)
      res.send("shoes entry doesn't exist")
    })
  }
})

app.listen(PORT, ()=> {
  console.log(`Now accepting connection on port ${PORT}`)
})