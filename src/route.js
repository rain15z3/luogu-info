const express = require('express');
const conf = require('./conf');
let app = express();

app.get('/register', ($req, $res) => {

});

app.get('/gen', ($req, $res) => {

});

app.listen(conf['port']);
