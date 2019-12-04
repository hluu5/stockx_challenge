const bunyan = require('bunyan');

module.exports = {
  log: bunyan.createLogger({
    name: "bunyan-log",
    streams: [
      {
        level: 'debug',
        path: './appLog.log' // log INFO and above to stdout
      },
      {
        level: 'error',
        path: './appError.log' // log ERROR and above to a file
      }
    ]
  })
};
