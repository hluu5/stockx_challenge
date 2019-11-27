const { pool } = require('./index.js');

const schemaQuery = `
  CREATE SCHEMA IF NOT EXISTS stockx;
  SET search_path TO stockx
`

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS shoes(
    shoes_id SERIAL PRIMARY KEY,
    shoesname VARCHAR (50) UNIQUE NOT NULL,
    size_data JSON,
    true_to_size_calculation INT
  );
`

//index shoes name for faster lookup
const createIndexQuery = `
  CREATE INDEX shoesname ON stockx.shoes
  USING btree
  ( shoesname ASC )
`

pool.connect().then((client)=>{
  client
  .query(schemaQuery)
  .then(()=>{
    return client.query(createTableQuery)
  })
  .then(()=>{
    return client.query(createIndexQuery)
  })
  .then((res)=>{
    client.release();
    console.log(res)
  })
}).catch((err)=>{
  client.release();
  console.log(err)
})

