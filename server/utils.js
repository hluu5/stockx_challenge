const bunyan = require('bunyan');

module.exports = {
  log: bunyan.createLogger({
    name: "bunyan-log",
    streams: [
      {
        level: 'debug',
        path: './logs/appLog.log' // log INFO and above to a file
      },
      {
        level: 'error',
        path: './logs/appError.log' // log ERROR and above to a file
      }
    ]
  })
};
