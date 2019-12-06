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
  checkPasswordMiddleware,
  checkPasswordMiddleware2
} = require('./controllers/controllers.js')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/openapi.json');
const {
  checkUsername, checkPassword, checkURL,
  checkBodyForPassword, checkBodyForShoesName,
  checkBodyForShoesSize, checkBodyForTrueToSizeCal, checkBodyForUsername
} = require('../validators/validators.js');
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//import PORT variable from .env file. This file is supposed to be ignored from github commit in real production
//and instruction to set up .env file will be given to team members
//Also, it's better to use a secret system management such as the AWS System Manager.
const PORT = process.env.PORT;

//Set up route for swagger UI:
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req,res)=> {
  res.send(`Please go to localhost:${PORT}/trueToSizeCalculation to get True To Size Calculation`)
})

//API to get true to size calculation using a request inside params
app.get('/trueToSizeCalculation', handleTrueToSizeCalculation)

//API to get true to size calculation using a request inside URL
app.get('/trueToSizeCalculation/:shoesname', handleTrueToSizeCalculationURL)

//API to create a fake writestream to client. This stimulates a crowd sourcing api:
app.get('/fakeStream', serveFakeStream)

//Simple authentication middleware. In real production, I could use Passport for authentication handler
//and express-session to persist login session.
app.get('/readJSONStreamAndStore', [checkPassword, checkUsername],checkPasswordMiddleware2)

//API to read from a crowd-sourced stream, process data, then save to db:
app.get('/readJSONStreamAndStore', [checkURL], retrieveParseAndInsertToPostgres)

//API to manually save to db, authencatiion middleware:
app.post('/createNewEntry',[checkBodyForUsername, checkBodyForPassword], checkPasswordMiddleware)

//API to manually save to db, with validate input middleware:
app.post('/createNewEntry', [
  checkBodyForShoesName, checkBodyForShoesSize, checkBodyForTrueToSizeCal
], handleCreateNewEntry)

module.exports = app.listen(PORT, ()=> {
  log.info(`Now accepting connection on port ${PORT}`)
})

