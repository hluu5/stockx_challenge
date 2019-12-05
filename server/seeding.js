const axios = require('axios');
const {log} = require('./utils.js');
const dotenv = require('dotenv');
dotenv.config();

axios({
  url: `http://192.168.99.100:4000/readJSONStreamAndStore`,
  method: 'GET',
  params: {
    url: `http://192.168.99.100:4000/fakeStream`,
    username: 'admin',
    password: 'admin'
  }
})
.then(data=>log.info(data.data))
.catch(err=>log.error(err))
