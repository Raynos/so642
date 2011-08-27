var express = require("express"),
	uuid = require("node-uuid"),
	everyauth = require("everyauth"),
	gzip = require('connect-gzip');

var configure = function(app, sessionStore) {

	app.configure(function(){
		app.set('views', __dirname + '/../public/views');
		app.set("view engine", "jade");
		app.use(express.bodyParser());
		app.use(function(req, res, next) {
			req.body = req.body || {};
			next();
		});
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({ 
			store: sessionStore,
			secret: uuid(),
			key: 'express.sid'
		}));
		app.use(everyauth.middleware());
		app.use(app.router);
		app.use(gzip.staticGzip(__dirname + '/../public'));
		app.use(gzip.gzip());
	});

	app.configure('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function(){
		app.use(express.errorHandler());
	});
};

module.exports = configure;