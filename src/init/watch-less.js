var watch = require("watch"),
    exec = require("child_process").exec;

function writeCSS(dir) {
    var cmd = "lessc " + dir + "/site.less > " + dir + "/site.css";
    var less = exec(cmd);
    var cmd = "lessc " + dir + "/chat.less > " + dir + "/chat.css";
    var less = exec(cmd);
}

module.exports = function() {
    // watch for less file changes
    var dir = __dirname + "/../public/css";
    watch.watchTree(dir, function _onchange(f, curr, prev) {
        if (/.less/.test(f)) {
            console.log("rewriting less");
            writeCSS(dir);
        }
    });
    writeCSS(dir);
}
    