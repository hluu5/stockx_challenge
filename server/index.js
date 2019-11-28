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
  //Note this API doesn't need to handle error because error is being handled internally
  //by retrieveShoesData function and it sending error as data
  if (req.query) {
    retrieveShoesData(req.query.shoesname, data => {
      res.send(data)
    })
  }
})


app.listen(PORT, ()=> {
  console.log(`Now accepting connection on port ${PORT}`)
})