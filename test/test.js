const createNewEntries = require('../postgresDB/index.js').createNewEntries;
const pool = require('../postgresDB/index.js').pool;

pool.connect()
.then((client)=>{
  createNewEntries('shoses34w32342', {
    "1": 30,
    "2": 20
  }, 3)
})
.catch((err)=>{
  // client.release();
  console.error(err)
})
