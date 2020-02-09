const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');

const app = express();

const apiService = process.env.API_ROUTE || 'api';
const apiUrl = apiService ? `http://${apiService}:5555` : 'http://api:5555';

console.log(apiUrl);

var apiProxy = proxy('/api', {
    target : apiUrl,
    changeOrigin : false
});

app.use(express.static(path.join(__dirname, 'build')));
app.use(apiProxy);

app.get('/status', function(req, res) {
    res.sendStatus(200);
    console.log('working!');
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let server = app.listen(3000);