
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

module.exports = function ( socket, codec ) {

  var events = new EventEmitter();

  if ( typeof codec != 'object' ) {
    codec = {
      encode: function ( data ) { return data; },
      decode: function ( data ) { return data; }
    };
  }

  socket.on( 'message', function ( message ) {
    message = codec.decode( message );
    // console.log( 'message', message, _.omit( message, 'command' ) );
    events.emit( message.command, _.omit( message, 'command' ) );
  });

  return {
    on: function ( event, fn ) { events.on.apply( events, arguments ); },
    emit: function ( event, message ) {
      data = codec.encode( _.extend( message, { command: event } ) );
      // console.log( 'emit', data );
      socket.send( data );
    }
  };

};