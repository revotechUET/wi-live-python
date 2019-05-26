const WebSocket = require('ws');
module.exports = WSServer;

function WSServer(express, port) {
    let wss = new WebSocket.Server({
        server:express.listen(port, function() {
            console.log("START");
        })
    });
    let activeSockets = {};

    wss.on('connection', function(ws) {
        console.log('On connection');
        ws.on('message', function(msg) {
            try {
                let msgObj = JSON.parse(msg);
                console.log('connect message', msg, msgObj);
                switch (msgObj.type) {
                    case 'connect': 
                        let id = msgObj.wiId;
                        activeSockets[id] = ws;
                        ws._wiId = msgObj.wiId;
                        break;
                }
            }
            catch(e) {
                console.error(e);
            }
        });
        ws.on('close', function(code, reason){
            console.log('on close', code, reason);
            let wiId = ws._wiId;
            if (wiId) {
                delete activeSockets[wiId];
            }
        });
    });
    this.send = send;
    function send(wiId, content) {
        let ws = activeSockets[wiId];
        //console.log(ws?"found":"not found");
        ws && ws.send(typeof content === 'object' ? JSON.stringify(content):content);
    }
    this.dump = dump;
    function dump(){
        return JSON.stringify(Object.keys(activeSockets));
    }
    this.get = express.get.bind(express);
    this.post = express.post.bind(express);
}
