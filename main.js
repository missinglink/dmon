
var Manager = require('./lib/Manager');
var Client = require('./lib/Client');

// Client.adapters['child'] = require('./adapters/child');
// Client.adapters['pair'] = require('./adapters/pair');

module.exports = {
  manager: new Manager(),
  client: require('./adapters/messagebus'),
  codec: {
    json: {
      encode: JSON.stringify,
      decode: JSON.parse
    }
  }
};