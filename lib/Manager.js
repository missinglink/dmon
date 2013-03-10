
var path = require('path');
var child = require('child_process');

// Daemon manager
function Manager () {
  this.children = [];
  this.middleware = [
    require('../middleware/utf'),
    require('../middleware/logger'),
    require('../middleware/discovery')
  ];
}

// Use middleware
Manager.prototype.use = function ( middleware ) {
  this.middleware.push( middleware );
};

// Load config file
Manager.prototype.load = function ( basepath ) {
  try {
    var dmon = require( basepath + '/dmon' );
    dmon.basepath = basepath;
    this.children.push( dmon );
  }

  catch (e) {
    return console.log( 'Failed to load: ' + basepath + '/dmon.json' );
  }
};

// Spawn new child processes
Manager.prototype.spawn = function ( dmon ) {
  var env = process.env;
  env['NODE_PATH'] = dmon.basepath + '/node_modules';

  // Start new child process
  dmon.process = new child.spawn(
    ( dmon.command || 'npm' ),
    ( dmon.args || [ 'start' ] ),
    {
      env: env,
      cwd: dmon.basepath,
      stdio: [ 'ipc' ]
    }
  );

  // Notify middleware
  this.middleware.map( function( middleware ) {
    middleware( dmon );
  });
};

// Fire away!
Manager.prototype.start = function () {
  for ( var dmon in this.children ) {
    this.spawn( this.children[ dmon ] );
  }
};

module.exports = Manager;