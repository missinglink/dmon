
// This is and example of how to use the IPC
// channel from parent -> child to do service discovery

var winston = require('winston');
winston.cli();

var debug = function ()
{
  // winston.data.apply( null, arguments );
};

var client = require('../lib/client');

module.exports = function( roles ) {

  return function( dmon ) {

    var ipc = client( dmon.process );

    ipc.on( 'service::connect', function ( data ) {
      debug( 'service::connect', data );

      if( !roles || typeof roles[ data.role ] != 'function' ) {
        return winston.error( 'Role not defined: ' + data.role );
      }

      ipc.emit( 'service::assign', {
        role: data.role,
        host: roles[ data.role ]()
      });
    });

    ipc.on( 'service::find', function ( data ) {
      debug( 'service::find', data );

      if( !roles || typeof roles[ data.role ] != 'function' ) {
        return winston.error( 'Role not defined: ' + data.role );
      }

      ipc.emit( 'service::discovery', {
        role: data.role,
        host: roles[ data.role ]()
      });
    });

  };
};