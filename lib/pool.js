
var dns = require('native-dns');

var request = function ( name, type, cb ) {

  var discovery = dns.Request({
    question: dns.Question({ name: name, type: type }),
    server: { address: '0.0.0.0', port: 15353, type: 'udp' },
    timeout: 1000
  });

  discovery.on( 'message', function (err, res) {
    // console.log( res.answer );
    if( !res || !res.answer || !res.answer.length ){
      return cb( 'DNS invalid answer' );
    }
    return cb( null, res.answer[0] );
  });

  discovery.on( 'timeout', function() {
    console.log('DNS timeout');
    return cb('DNS timeout');
  });

  discovery.send();
};

module.exports = function ( role ) {

  return {
    connect: function ( cb ) { request( role, 'MX', cb ); },
    find: function ( query, cb ) { request( role, 'A', cb ); }
  };
};