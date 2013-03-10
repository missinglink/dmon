
var dns = require('native-dns');

module.exports = function ( role ) {

  var discovery = dns.Request({
    question: dns.Question({ name: role }),
    server: { address: '0.0.0.0', port: 15353, type: 'udp' },
    timeout: 1000
  });

  return {
    connect: function ( cb ) {

      discovery.on( 'message', function (err, res) {
        // console.log( res.answer );
        if( !res || !res.answer || !res.answer.length ){
          return cb( 'DNS invalid answer' );
        }
        return cb( null, res.answer[0] );
      });

      discovery.on( 'timeout', function() {
        console.log('DNS timeout');
        cb('DNS timeout');
      });

      discovery.send();
    }
  };
};