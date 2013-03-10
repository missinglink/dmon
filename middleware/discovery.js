
var roles = {
  socketserver: "ws://localhost:2000",
  webserver: "http://localhost:3000",
  fileserver: "http://localhost:3001",
  geoservice: "ipc:///tmp/zombie.geo.sock"
};

module.exports = function( dmon ){

  dmon.process.on( 'message', function ( data ) {

    console.log( 'middleware:', data );

    if( data.command == 'service::connect' ){
      dmon.process.send({
        command: 'service::assign',
        role: data.role,
        host: roles[ data.role ]
      });
    }

    if( data.command == 'service::find' ){
      dmon.process.send({
        command: 'service::discovery',
        role: data.role,
        host: roles[ data.role ]
      });
    }

  });


};