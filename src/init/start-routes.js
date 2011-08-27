var fs = require("fs"),
    parseCookie = require('connect').utils.parseCookie;

module.exports = function(app, sessionStore) {
    var modelUrl = __dirname + "/../model/",
        models = fs.readdirSync(modelUrl),
        routeUrl = __dirname + "/../route/"
        routes = fs.readdirSync(routeUrl);

    var io = require("socket.io").listen(app);

    io.set("authorization", function(data, accept) {
        if (data.headers.cookie) {
            data.cookie = parseCookie(data.headers.cookie);

            data.sessionId = data.cookie['express.sid'];

            sessionStore.get(data.sessionId, function(err, session) {
                
                if (err) {
                    return accept(err.message, false);
                } else if (!(session && session.auth)) {
                    return accept("not authorized", false)
                }
                data.session = session;
                accept(null, true);
            });
        } else {
            return accept('No cookie', false);
        }
    });

    routes.forEach(function(file) {
        var route = require(routeUrl + file),
            model = require(modelUrl + file);

        route(app, model, io);
    });
};