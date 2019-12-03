const { createNewEntry, deleteEntry, getUser }= require('./postgresDB/index.js');
const { retrieveShoesData, pgQuery } = require('./postgresDB/index.js');
const { pool } = require('./postgresDB/index.js');
const axios = require('axios');
const request = require('supertest')
const fetch = require('node-fetch')
// const app = require('./server/index.js');

let query = "SELECT shoes_id, shoesname, size_data, true_to_size_calculation FROM stockx.shoes WHERE shoesname = ($1)"
// let query = "DELETE FROM stockx.shoes WHERE shoesname = ($1)"
// createNewEntry('shoes1', {'1':'20'} ,3)
// retrieveShoesData('shoes1', (data)=> {console.log(data)})
// deleteEntry('shoes1')

// pgQuery(query, ['shoes4'], (res)=> {
//   console.log(res.rows)
// })
// const connect = async() => {
//   const url = 'http://localhost:4000/login';
//   const url1 = 'http://localhost:4000/createNewEntry';
//   const data = {
//     username: 'admin',
//     password: 'admin'
//   }
//   const data2 = {
//           shoesName: 'shoes213',
//           shoesSize: {'1':20, '2':30},
//           trueToSizeCalculation: 3
//         }
//   const response = await fetch(url, {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     // mode: 'same-origin', // no-cors, *cors, same-origin
//     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'include', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json'
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     // redirect: 'follow', // manual, *follow, error
//     // referrer: 'no-referrer', // no-referrer, *client
//     body: JSON.stringify(data) // body data type must match "Content-Type" header
//   });
//   await console.log(response)
//   const res1 = await fetch(url1, {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     // mode: 'same-origin', // no-cors, *cors, same-origin
//     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'include',//'same-origin', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json'
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     // redirect: 'follow', // manual, *follow, error
//     // referrer: 'no-referrer', // no-referrer, *client
//     body: JSON.stringify(data2) // body data type must match "Content-Type" header
//   })
//   await console.log(res1)
// }

// connect();
// axios({
//   url: 'http://127.0.0.1:4000/login',
//   method: 'POST',
//   headers: {
//     withCredentials: true,
//   },
//   data: {
//     username: 'admin',
//     password: 'admin'
//   }
// })
// .then(data=> {
  axios({
    url: 'http://127.0.0.1:4000/createNewEntry',
    method: 'POST',
    data: {
      username: 'admin1',
      password: 'admin',
      shoesName: 'shoes213231',
      shoesSize: {'1':20, '2':30},
      trueToSizeCalculation: 3
    }
  })
  .then(data=> console.log(data.data))
  .catch(err=>console.log(err.response.data))
// })
// .catch(err=>console.log(err))

// getUser('admisn')y