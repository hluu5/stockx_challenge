const { pool, pgQuery } = require('./index.js');
const { log } = require('../server/utils.js');
const bcrypt = require('bcryptjs');

const schemaQuery = `
  CREATE SCHEMA IF NOT EXISTS stockx;
  SET search_path TO stockx
`

const createShoesTableQuery = `
  CREATE TABLE IF NOT EXISTS shoes(
    shoes_id SERIAL PRIMARY KEY,
    shoesname VARCHAR (50) UNIQUE NOT NULL,
    size_data JSON,
    true_to_size_calculation REAL
  )
`

//index shoes name for faster lookup
const createShoesIndexQuery = `
  CREATE INDEX IF NOT EXISTS shoesname ON stockx.shoes
  USING btree
  ( shoesname ASC )
`

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR NOT NULL
  )
`

const createUserIndexQuery = `
  CREATE INDEX IF NOT EXISTS username ON stockx.users
  USING btree
  ( username ASC )
`

//Create initial Admin that could log in and use server
const createInitialAdmin = ()=> {
  const query = 'INSERT INTO stockx.users(username, password) VALUES($1, $2) RETURNING *'
  const password = bcrypt.hashSync('admin', 10);
  const values = ['admin', password]
  pgQuery(query,values, (data)=> {
    log.info('Admin User Created In Postgres: ', data.rows)
  })
}

const connect = async ()=> {
  try{
    let client = await pool.connect();
    await client.query(schemaQuery);
    await client.query(createShoesTableQuery);
    await client.query(createShoesIndexQuery);
    await client.query(createUserTableQuery);
    await client.query(createUserIndexQuery);
    await client.release();
    await createInitialAdmin();
  }
  catch(err){
    pool.end();
    log.error('ERROR IN CREATING DB AND RECORD: ', err)
  }
}

connect();

