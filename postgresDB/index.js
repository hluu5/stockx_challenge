const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  //your username for postgres here
  user: 'postgres',
  //host should be ip address of your postgres container, your cloud postgres db or your local postgres db
  host: process.env.POSTGRES_HOST,
  //Connect to PORT that is dedicated to your postgres db. Default is 5432.
  port: 5432,
  //created by running 'npm run createdb'
  database: 'stockx',
  //your password here
  password: process.env.PASSWORD,
  //max connections of clients
  max: 10,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 10000,
})

// the pool will emit an error on behalf of any idle clients
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect().then(()=>{
  console.log('connected to Postgres')
}).catch(err=>console.log(err))

const pgQuery = (q, params, callback) => {
  const start = Date.now();
  pool.query(q, params, (err, res) => {
    const duration = Date.now() - start
    callback(err, res)
    console.log('executed query', { q, duration: duration +`ms`, rows: res.rowCount, inserted: res.rows })
  })
};

//Utility function to debug last client blocking the pool
const getClient = (callback) => {
  pool.connect((err, client, done) => {
    const query = client.query.bind(client)
    // monkey patch the query method to keep track of the last query executed
    client.query = () => {
      client.lastQuery = arguments
      client.query.apply(client, arguments)
    }
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!')
      console.error(`The last executed query on this client was: ${client.lastQuery}`)
    }, 5000)
    const release = (err) => {
      // call the actual 'done' method, returning this client to the pool
      done(err)
      // clear our timeout
      clearTimeout(timeout)
      // set the query method back to its old un-monkey-patched version
      client.query = query
    }
    callback(err, client, release)
  })
}

const retrieveShoesData = (shoesName, callback) => {
  const findExistingShoes = "SELECT shoes_id, shoesname, size_data, true_to_size_calculation FROM stockx.shoes WHERE shoesname = ($1)"
  pgQuery(findExistingShoes,[shoesName], (err,res)=> {
    if (err) console.log(err);
    if (res) callback(res.rows);
  })
}

const createNewEntry = (shoesName, shoesSize, trueToSizeCalculation)=> {
  // const findExistingShoes = "SELECT shoesname FROM stockx.shoes WHERE shoesname = ($1)"
  const query = 'INSERT INTO stockx.shoes(shoesname, size_data, true_to_size_calculation) VALUES($1, $2, $3) RETURNING *'
  const values = [shoesName, shoesSize, trueToSizeCalculation]
  //Check if entry already exists
  retrieveShoesData(shoesName, (res)=> {
    if (res.length > 0) {
      console.error('ERROR: This shoes entry already exists')
    }
    if (res.length === 0) {
      pgQuery(query,values, (err,res) => {
        if (err) console.log(err)
      })
    }
  })
}

module.exports = {
  pool,
  createNewEntry,
  retrieveShoesData ,
  pgQuery,
  getClient
}
