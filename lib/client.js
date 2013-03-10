
var EventEmitter = require('events').EventEmitter;

var debug = function () {
  // console.log.apply( null, arguments );
};

module.exports = function ( socket, codec ) {

  var events = new EventEmitter();

  socket.on( 'message', function ( message ) {
    message = ( codec && codec.decode ) ? codec.decode( message ) : message;
    debug( 'message', message );
    events.emit( message.command, message );
  });

  return namespace( events, socket, codec, 'default' );
};

function namespace( events, socket, codec, channel ) {

  var ns = {
    on: function ( event, fn ) {
      events.on( event, function ( message ) {
        if ( channel == 'default' || message.channel == channel ) {
          fn( message );
        } else {
          debug( 'skipping channel: ' + message.channel );
        }
      });
    },
    emit: function ( event, message ) {
      var data = { command: event, channel: channel, body: message };
      var encoded = ( codec && codec.encode ) ? codec.encode( data ) : data;
      debug( 'emit', encoded );
      socket.send( encoded );
    },
    of: function ( channel ) {
      debug( 'new channel', channel );
      return namespace( events, socket, codec, channel );
    }
  };

  return ns;
}