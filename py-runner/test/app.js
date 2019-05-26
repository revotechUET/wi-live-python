var pythonRun = require('../');
var express = require('express');
var fs = require('fs');
var app = express();
 
app.listen(3000, function() {
    console.log("start on port", 3000);
});

app.get('/run', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    pythonRun('mypython.py', function(data) {
        console.log(data);
        res.write(data);
    }, function(data) {
        console.log(data);
        res.write(data);
    }, function(code) {
        console.log("Finish", code);
        res.end();
    });
});
