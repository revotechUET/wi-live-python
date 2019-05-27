let express = require('express');
const {pyRunner, server} = require("live-python-server");
// let pyRunner = require('py-runner');
const cors = require('cors');

// let WSServer = require('live-python-server');
let WSServer = server;
let port = 3030;

let app = express();
app.use(express.static('../client'));
app.use(express.json());
app.use(cors());
let wsServer = new WSServer(app, port);

wsServer.post('/run', function(req, res) {
    let pyFile = req.body.pyFile; 
    let wiId = req.body.wiId || req.query.wiId;
    let key = req.body.key || req.query.key;
    pyRunner(pyFile, log2WS, log2WS, function(code) {
        log2WS("DONE");
    }, {
        cwd: '/mnt/d/workspace/wi-live-python/py-runner/test'
    });
    res.send({
        code: 200,
        reason: "Call python started"
    });
    function log2WS(data, error) {
        wsServer.send(wiId, {
            key: key,
            content: data.toString(),
            error: error
        });
    }
});
