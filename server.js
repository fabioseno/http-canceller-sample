var express     = require('express');
//var bodyParser  = require('body-parser');
var app         = express();
var port        = process.env.PORT || 8080;

//app.use(bodyParser());

app.all('*', function (req, res, next) {
    'use strict';
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    
    next();
});

app.get('/test/:id', function (req, res) {
    
    var delay = (2 + (Math.random() * 5)) * 1000;
    
    console.log('Request received...');
    
    setTimeout(function () {
        console.log('Request processed!');
        res.send('ok');    
    }, delay);
});

// STARTING SERVER
console.log('listening on port ' + port);

app.listen(port);