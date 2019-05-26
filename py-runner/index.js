var exec = require('child_process').spawn;
module.exports = function(pyFile, stdoutCb, stderrCb, onDone, opts = {}) {
    var pythonProc = exec('stdbuf', ['-oL', '-eL', 'python', pyFile], {stdio: ['pipe','pipe','pipe'], ...opts});
    pythonProc.stdout.on('data', function(data){
        stdoutCb && stdoutCb(data);
    });
    pythonProc.stderr.on('data', function(data){
        stderrCb && stderrCb(data, true);
    });
    pythonProc.on('exit', function(code) {
        onDone && onDone(code);
    });
}
