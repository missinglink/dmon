
var EventEmitter = require('events').EventEmitter;

var debug = function () {
  // console.log.apply( null, arguments );
};

module.exports = function ( socket, codec ) {

  var events = new EventEmitter();

  socket.on( 'message', function ( message ) {
    message = ( codec && codec.decode ) ? codec.decode( message ) : message;
    debug( 'message', message.body );
    events.emit( message.command, message.body );
  });

  return {
    on: function ( event, fn ) { events.on.apply( events, arguments ); },
    emit: function ( event, message ) {
      var data = { command: event, body: message };
      var encoded = ( codec && codec.encode ) ? codec.encode( data ) : data;
      debug( 'emit', encoded );
      socket.send( encoded );
    }
  };
};