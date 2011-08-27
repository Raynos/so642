var express = require('express'),
    bootstrap = require('./init/bootstrap.js'),
    app;

if (!module.parent) {
    app = module.exports = express.createServer();
    bootstrap(app);
}