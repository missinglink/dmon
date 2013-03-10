
// Daemon client
function Client ( type ) {

  if( typeof Client.adapters[type] == 'function' ) {
    return Client.adapters[type]();
  }

  else {
    console.log( 'No adapter found for client type: ' + type );
  }
}

Client.adapters = {};
Client.adapter = function ( type, cb ) {
  Client.adapters[type] = cb;
};

module.exports = Client;