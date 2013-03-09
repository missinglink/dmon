
function Utf8 ( dmon ){
  dmon.process.stdin.setEncoding('utf-8');
  dmon.process.stdout.setEncoding('utf-8');
  dmon.process.stderr.setEncoding('utf-8');
}

module.exports = Utf8;