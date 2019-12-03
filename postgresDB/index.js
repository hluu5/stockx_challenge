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

const pgQuery = async (q, params, callback) => {
  const start = Date.now();
  try {
    const result = await pool.query(q, params)
    const duration = await Date.now() - start;
    await console.log('executed query', { q, duration: duration +`ms`})
    return await callback(result)
  }
  catch(err){ console.log(err) }
};

const getUser = async(username) => {
  const query = "SELECT * FROM stockx.users WHERE username = ($1)"
  return await pgQuery(query,[username],async(data)=>{
    console.log(data.rows)
    return await data
  })
}

const retrieveShoesData = async (shoesName, callback) => {
  const findExistingShoes = "SELECT shoes_id, shoesname, size_data, true_to_size_calculation FROM stockx.shoes WHERE shoesname = ($1)"
  return await pgQuery(findExistingShoes,[shoesName], async (res)=> {
    if (res) {
      return await callback(res.rows)
    };
  })
}

const createNewEntry = async (shoesName, shoesSize, trueToSizeCalculation) => {
  // const findExistingShoes = "SELECT shoesname FROM stockx.shoes WHERE shoesname = ($1)"
  const query = 'INSERT INTO stockx.shoes(shoesname, size_data, true_to_size_calculation) VALUES($1, $2, $3) RETURNING *'
  const values = [shoesName, shoesSize, trueToSizeCalculation]
  //Check if entry already exists
  return await retrieveShoesData(shoesName, (res)=> {
    if (res.length > 0) {
      const error = 'ERROR: This shoes entry already exists'
      console.error(error)
      return error
    }
    if (res.length === 0) {
      return pgQuery(query,values, (res) => {
        return res.rows
      })
    }
  })
}

const deleteEntry = async (shoesname) => {
  const query = 'DELETE FROM stockx.shoes WHERE shoesname = ($1)'
  const value = [shoesname];
  //Check if entry already exists
  return await retrieveShoesData(shoesname, async (res)=> {
    if (res.length === 0) {
      const error = "ERROR: This shoes entry doesn't exist"
      console.error(error)
      return error
    }
    if (res.length > 0) {
      return await pgQuery(query, value, async (res) => {
        return await res.rows
      })
    }
  })
}

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

module.exports = {
  pool,
  createNewEntry,
  retrieveShoesData ,
  pgQuery,
  getClient,
  deleteEntry,
  getUser
}