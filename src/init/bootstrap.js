var configure = require("./app-configure.js"),
    less = require("./watch-less.js"),
    everyauth = require("./config-everyauth.js"),
    routes = require("./start-routes.js"),
    tools = require("buffertools"),
    nko = require("nko"),
    sessionStore = new (require("express").session.MemoryStore)()

module.exports = function(app) {
    everyauth(app);
    configure(app, sessionStore);
    less();
    routes(app, sessionStore);
    nko('/9Ehs3Dwu0bSByCS');


    app.listen(process.env.PORT);
    console.log("server listening on port xxxx");
};