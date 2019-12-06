const { query, body, oneOf } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  checkUsername: query('username').not().isEmpty().withMessage('must provide username'),
  checkPassword: query('password').not().isEmpty().withMessage('must provide password'),
  checkURL: query('url')
            .not().isEmpty().withMessage('must provide a crowd-sourced API')
            .matches(/(http\:\/\/.*\:4000)/g).withMessage("must prepend 'http://' before host address"),
  checkBodyForUsername: body('username').not().isEmpty().withMessage('must provide username'),
  checkBodyForPassword: body('password').not().isEmpty().withMessage('must provide password'),
  checkBodyForShoesName: body('shoesName').not().isEmpty().withMessage('must provide shoesname'),
  checkBodyForShoesSize: oneOf([
    body('shoesSize.1').exists().withMessage('must provide a shoes size').isNumeric().withMessage('shoes data must be a number'),
    body('shoesSize.2').exists().withMessage('must provide a shoes size').isNumeric().withMessage('shoes data must be a number'),
    body('shoesSize.3').exists().withMessage('must provide a shoes size').isNumeric().withMessage('shoes data must be a number'),
    body('shoesSize.4').exists().withMessage('must provide a shoes size').isNumeric().withMessage('shoes data must be a number'),
    body('shoesSize.5').exists().withMessage('must provide a shoes size').isNumeric().withMessage('shoes data must be a number')
  ]),
  checkBodyForTrueToSizeCal: body('trueToSizeCalculation')
                             .not().isEmpty().withMessage('must provide AvgTrueToSizeCal')
                             .isNumeric().withMessage('AvgTrueToSizeCal must be a number'),

}