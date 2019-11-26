const express = require('express');
const app = express();

// const PORT = 4000;
console.log(process.env.PORT)
app.listen(PORT, ()=> {
  console.log(`Now accepting connection on port ${PORT}`)
})