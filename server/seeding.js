const axios = require('axios');
const {log} = require('./utils.js');
const dotenv = require('dotenv');
dotenv.config();

axios({
  url: `${process.env.HOST}:4000/readJSONStreamAndStore`,
  method: 'GET',
  params: {
    url: `${process.env.HOST}:4000/fakeStream`,
    username: process.env.SERVER_USER,
    password: process.env.SERVER_PASSWORD
  }
})
.then(data=>log.info(data.data))
.catch(err=>log.error(err))
