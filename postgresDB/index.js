const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  //your username for postgres here
  user: 'postgres',
  //host should be ip address of the container or your VM
  host: 'localhost',
  //remember to create one if it's not already there. You can do this with pgAdmin. Login to your account
  //Click on PostgresSQL 10. Right Click on Databases and Create new one
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
})

const pgQuery = (q, params, callback) => {
  const start = Date.now();
  return pool.query(q, params, (err, res) => {
    const duration = Date.now() - start
    console.log('executed query', { q, duration, rows: res.rowCount })
    callback(err, res)
  })
};

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

const createNewEntries = (shoesName, shoesSize, trueToSizeCalculation)=> {
  const query = 'INSERT INTO stockx.shoes(shoesname, size_data, true_to_size_calculation) VALUES($1, $2, $3) RETURNING *'
  const values = [shoesName, shoesSize, trueToSizeCalculation]
  pgQuery(query,values, (err,res)=> {
    // client.release();
    if (err) console.error(err);
    // console.log(res);
  })
  // client
  // .query(query,values)
  // .then(data =>console.log(data))
  // .then(()=> client.release())
  // .catch(err=>console.error(err))
}

module.exports = {
  pool,
  createNewEntries,
  pgQuery
}
