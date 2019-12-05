const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const { log } = require('../server/utils.js')

const pool = new Pool({
  //your username for postgres here
  user: 'postgres',
  //host should be ip address of your postgres container, your cloud postgres db or your local postgres db
  host: '192.168.99.100',
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
  log.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect().then(()=>{
  log.info('connected to Postgres')
}).catch(err=>log.error(err))

const pgQuery = async (q, params, callback) => {
  const start = Date.now();
  try {
    const result = await pool.query(q, params)
    const duration = await Date.now() - start;
    await log.info('executed query', { q, duration: duration +`ms`, params})
    return await callback(result)
  }
  catch(err){ log.error('ERROR QUERYING: ', err) }
};

const getUser = async(username) => {
  const query = "SELECT * FROM stockx.users WHERE username = ($1)"
  return await pgQuery(query,[username],async(data)=>{
    log.info('USER:', data.rows)
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
  return await retrieveShoesData(shoesName, async (res)=> {
    if (res.length > 0) {
      const error = 'ERROR: This shoes entry already exists'
      await log.error(error, shoesName)
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
      log.error(error, shoesName)
      return error
    }
    if (res.length > 0) {
      return await pgQuery(query, value, async (res) => {
        return await res.rows
      })
    }
  })
}

const updateExistingEntry = async (shoesname, shoesSize, avgTrueToSize) => {
  const query = 'UPDATE stockx.shoes SET (size_data, true_to_size_calculation) = ($2, $3) WHERE shoesname = ($1)'
  const values = [shoesname, shoesSize,avgTrueToSize];
  return await pgQuery(query,values, (res)=> {
    log.info(res.rows)
  })
}

module.exports = {
  pool,
  createNewEntry,
  retrieveShoesData ,
  pgQuery,
  deleteEntry,
  getUser,
  updateExistingEntry
}