
var winston = require('winston');
var config = require('./winston.config');

var logger = {};
var colors = config.colors;
var levels = config.levels;

function setup ( dmon ) {

  colors[ dmon.name ] = ( dmon.color || 'white' );
  colors[ '!' + dmon.name ] = 'red';
  levels[ dmon.name ] = 10 + parseInt( dmon.process.pid, 10 );
  levels[ '!' + dmon.name ] = 100 + parseInt( dmon.process.pid, 10 );

  logger = new winston.Logger({
    transports: [ new winston.transports.Console({ colorize: true }) ],
    levels: levels,
    colors: colors
  });
}

module.exports = function( dmon ){

  setup( dmon );

  dmon.process.stdout.on( 'data', function ( data ) {
    var stdout = data.trim().split('\n').map( logger[ dmon.name ] );
  });
  dmon.process.stderr.on( 'data', function (data) {
    var stderr = data.trim().split('\n').map( logger['!'+dmon.name ] );
  });
  dmon.process.on( 'exit', function (code) { logger['exit']( dmon.name + ' with code ' + code ); });
};