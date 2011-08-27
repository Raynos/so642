var watch = require("watch"),
	exec = require("child_process").exec;

module.exports = function() {
	// watch for less file changes
	var dir = __dirname + "/../public/css";
	watch.watchTree(dir, function _onchange(f, curr, prev) {
		if (/.less/.test(f)) {
			console.log("rewriting less");
			var cmd = "lessc " + dir + "/site.less > " + dir + "/site.css";
			var less = exec(cmd);
		}
	});
}
	