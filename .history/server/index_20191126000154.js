const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
console.log(PORT)
// app.listen(PORT, ()=> {
//   console.log(`Now accepting connection on port ${PORT}`)
// })