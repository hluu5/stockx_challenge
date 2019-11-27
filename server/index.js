const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

//import PORT variable from .env file. In a real production, this file will be
//ignored from github and instruction to set up .env file will be given to team members
const PORT = process.env.PORT;

app.get('/', (req,res)=> {
  res.send(`Please go to localhost:${PORT}/trueToSizeCalculation to get True To Size Calculation`)
})

app.get('/trueToSizeCalculation', (req,res)=> {

})

app.listen(PORT, ()=> {
  console.log(`Now accepting connection on port ${PORT}`)
})