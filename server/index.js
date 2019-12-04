require('newrelic');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { log } = require('./utils.js');
const {
  handleCreateNewEntry,
  handleTrueToSizeCalculation,
  serveFakeStream,
  retrieveParseAndInsertToPostgres,
  handleTrueToSizeCalculationURL,
  checkPasswordMiddleware
} = require('./controllers/controllers.js')

const dotenv = require('dotenv');
dotenv.config();

//import PORT variable from .env file. This file is ignored from github commit and
//instruction to set up .env file will be given to team members
//In real production, it's better to use a secret system management such as the AWS System Manager.
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req,res)=> {
  res.send(`Please go to localhost:${PORT}/trueToSizeCalculation to get True To Size Calculation`)
})

app.get('/trueToSizeCalculation', handleTrueToSizeCalculation)

app.get('/trueToSizeCalculation/:shoesname', handleTrueToSizeCalculationURL)

app.get('/fakeStream', serveFakeStream)

app.get('/readJSONStreamAndStore', retrieveParseAndInsertToPostgres)

//Simple authentication middleware. In real production, I could use Passport for authentication handler
//and express-session to persists login session.
//Unfortunately if we only make http request to login, it will refresh sessionID every time because no cookies
//was passed and stored from browser
app.post('/createNewEntry', checkPasswordMiddleware)

app.post('/createNewEntry', handleCreateNewEntry)

module.exports = app.listen(PORT, ()=> {
  log.info(`Now accepting connection on port ${PORT}`)
})

