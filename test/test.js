const createNewEntry = require('../postgresDB/index.js').createNewEntry;
const pgQuery = require('../postgresDB/index.js').pgQuery;
const pool = require('../postgresDB/index.js').pool;

createNewEntry('shoses344r2', {
    "1": 30,
    "2": 20
}, 3)


// const findExistingShoes = "SELECT shoesname FROM stockx.shoes WHERE shoesname = 'shoes1'"
// pgQuery(findExistingShoes, null, (err, res) => {
//   if (err) console.log(err)
//   if (res) console.log(res)
// })
