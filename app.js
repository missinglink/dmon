
var path = require('path');
var child = require('child_process');
var winston = require('winston');
var config = require('./config');

function Manager () {
  this.children = [];
}

Manager.prototype.load = function ( basepath ) {

  try {
    var dmon = require( basepath + '/dmon' );
    dmon.basepath = basepath;
    this.children.push( dmon );
    this.setupColors( dmon );
  }

  catch (e) {
    return console.log( 'Failed to load: ' + basepath + '/dmon.json' );
  }
};

Manager.prototype.setupColors = function ( dmon ) {

  // stdout
  config.levels[dmon.name] = 10 + this.children.length;
  config.colors[dmon.name] = dmon.color || 'white';

  // stderr
  config.levels['!'+dmon.name] = 100 + this.children.length;
  config.colors['!'+dmon.name] = 'red';
};

// Spawn new child processes
Manager.prototype.spawn = function ( dmon, logger ) {

  var env = process.env;
  env['NODE_PATH'] = dmon.basepath + '/node_modules';

  dmon.process = new child.spawn( 'npm', [ 'start' ], { env: env, cwd: dmon.basepath, stio: [ null, 1, 2 ] } );
  dmon.process.stdout.setEncoding('utf-8');
  dmon.process.stderr.setEncoding('utf-8');
  dmon.process.stdout.on( 'data', function (data) {
    var stdout = data.trim().split('\n').map( logger[ dmon.name ] );
  });
  dmon.process.stderr.on( 'data', function (data) {
    var stderr = data.trim().split('\n').map( logger['!'+dmon.name ] );
  });
  dmon.process.on( 'exit', function (code) { logger['exit']( dmon.name + ' with code ' + code ); });
};

Manager.prototype.start = function () {

  var logger = new winston.Logger({
    transports: [ new winston.transports.Console({ colorize: true }) ],
    levels: config.levels,
    colors: config.colors
  });

  // Fire away!
  for ( var dmon in this.children ) {
    this.spawn( this.children[ dmon ], logger );
  }
};

module.exports.manager = new Manager();