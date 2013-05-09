
## Getting Started

A daemon manager and service discovery module for nodejs.

Dmon is still in development, for now there are a only few tools available to use.

## Run all your services in a single window

If you have a SOA, you probably noticed the pain of opening 4 or more terminals when you get to work every day. dmon.manager() will spawn all these services in a child_process and pipe the stdout and stderr to one screen while coloring the output for easy readability.

### dmon.manager example.

```javascript
var path = require('path');
var dmon = require('dmon');

dmon.manager.use( dmon.middleware.logger );

// This boostrap spawns a new child process for each service listed here.
dmon.manager.load( path.resolve( './fresh8' ) );
dmon.manager.load( path.resolve( './fresh8-data' ) );
dmon.manager.load( path.resolve( './vote-api' ) );
dmon.manager.start();
```

### dmon.json

Each service will need to have a `dmon.json` file in the root of it's codebase; it contains information about how to control the child process.

```javascript
{
  "name": "my-service",
  "color": "blue",
  "command": "node",
  "args": [ "app.js", "config/local.json" ]
}
```

Screenshot
----------
![dmon](https://github.com/missinglink/dmon/raw/master/screenshot.png "dmon")