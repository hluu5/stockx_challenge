const bunyan = require('bunyan');
module.exports = {
  log: bunyan.createLogger({
    name: "bunyan-log",
    streams: [
        {
            level: 'info',
            path: '../appLog.json' // log INFO and above to stdout
        },
        {
            level: 'error',
            path: '../appError.json' // log ERROR and above to a file
        }
    ]
  })
};
