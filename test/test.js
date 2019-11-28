const createNewEntry = require('../postgresDB/index.js').createNewEntry;
const retrieveShoesData = require('../postgresDB/index.js').retrieveShoesData;
const pgQuery = require('../postgresDB/index.js').pgQuery;
const pool = require('../postgresDB/index.js').pool;
const axios = require('axios');

// createNewEntry('shoses3wq4r2', {
//     "1": 30,
//     "2": 20
// }, 3)

// retrieveShoesData('shoses3wq4r2', (res)=> {console.log(res)})
axios({
  url: 'http://localhost:4000/trueToSizeCalculation',
  method: 'GET',
  params: {
    shoesname: 'shoses'
  }
}).then(data=> console.log(data.data))
.catch(err=>console.log(err))
// const findExistingShoes = "SELECT shoesname FROM stockx.shoes WHERE shoesname = 'shoes1'"
// pgQuery(findExistingShoes, null, (err, res) => {
//   if (err) console.log(err)
//   if (res) console.log(res)
// })
