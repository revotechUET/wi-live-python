const serviceName = 'logStream';
angular.module(serviceName, []).factory(serviceName, function(wiConfig) {
    return new Service(wiConfig);
});

const uuidv4 = require('uuid/v4');
function Service(wiConfig) {
    let myId = uuidv4();
    let ws = new WebSocket(wiConfig.logStreamWS);
    let handlers = {};
    ws.onopen = function() {
        ws.send(JSON.stringify({
            type: 'connect',
            wiId: myId
        }));
    }
    ws.onmessage = function(evt) {
        try {
            let msg = JSON.parse(evt.data);
            let h = handlers[msg.key];
            h && h(msg);
        }
        catch(e) {
            console.error(e);
        }
    }
    this.registerCallback = function(key, cb) {
        handlers[key] = cb;
    }
    this.fetchGet = fetchGet;
    function fetchGet(path, params) {
        var url = new URL(wiConfig.logStreamHTTP + path);
        let _params = params || {};
        _params.wiId = myId;
        url.search = new URLSearchParams(_params);
        return fetch(url).then(function(response) {
            return response.json();
        });
    }
    this.fetchPost = fetchPost;
    function fetchPost(path, data = {}) {
        data.wiId = myId;
        var url = new URL(wiConfig.logStreamHTTP + path);
        return fetch(url, {
            method: 'POST', 
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json();
        });
    }
    this.startPromise = function(key) {
        return fetchGet('/start', {key:key});
    }
}
