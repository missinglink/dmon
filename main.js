
module.exports = {
  manager: require('./lib/manager'),
  client: require('./lib/client'),
  codec: {
    json: require('./lib/json')
  },
  middleware: {
    utf: require('./middleware/utf'),
    logger: require('./middleware/logger'),
    discovery: require('./middleware/discovery')
  }
};