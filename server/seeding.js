const axios = require('axios');
const {log} = require('./utils.js');
const dotenv = require('dotenv');
dotenv.config();

axios({
  url: `${process.env.HOST}:4000/readJSONStreamAndStore`,
  method: 'GET',
  params: {
    url: `${process.env.HOST}:4000/fakeStream`,
    username: 'admin',
    password: 'admin'
  }
})
.then(data=>log.info(data.data))
.catch(err=>{
  if (err.response) log.error(err.response.data)
  if (err) log.error(err)
})
