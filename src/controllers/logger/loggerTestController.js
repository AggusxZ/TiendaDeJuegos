const { logger } = require('../../utils/logger');

const loggerTest = (req, res) => {
  logger.debug('This is a debug log from /loggerTest');
  logger.http('This is an http log from /loggerTest');
  logger.info('This is an info log from /loggerTest');
  logger.warning('This is a warning log from /loggerTest');
  logger.error('This is an error log from /loggerTest');
  logger.fatal('This is a fatal log from /loggerTest');

  res.status(200).send('Logs generated successfully');
};

module.exports = {
  loggerTest,
};
