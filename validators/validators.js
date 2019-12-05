const { check, query, validationResult } = require('express-validator');

module.exports = {
  checkUsername: query('username').not().isEmpty().withMessage('must provide username'),
  checkPassword: query('password').not().isEmpty().withMessage('must provide password'),
  checkURL: query('url')
              .not().isEmpty().withMessage('must provide a crowd-sourced API')
              .matches(/(http\:\/\/.*\:4000)/g).withMessage("must prepend 'http://' before host address")


  // checkShoesname: [check('password').not().isEmpty().withMessage('must provide password')]
}