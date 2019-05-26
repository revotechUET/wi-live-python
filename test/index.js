let express = require('express');
let pyRunner = require('run-python');
const cors = require('cors');

let WSServer = require('live-server');
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
    }, {cwd: '/Users/remurd/workspace/revoltech/run-python/test'});
    res.send({
        code: 200,
        reason: "Call python started"
    });
    function log2WS(data, error) {
        wsServer.send(wiId, {
            key: key,
            content: data.toString(),
            error: error
        })
    }
});
/*
wsServer.get('/start', function(req, res) {
    let wiId = req.query.wiId;
    let key = req.query.key;
    let i = 0;
    function kickOff() {
        if (i < 5) {
            setTimeout(() => {
                wsServer.send(wiId, JSON.stringify({
                    key: key,
                    content: "This is a message " + i++
                }));
                kickOff();
            }, 500);
        }
    }
    kickOff();
    res.send({
        code: 200,
        reason: 'Success'
    });
});
*/
