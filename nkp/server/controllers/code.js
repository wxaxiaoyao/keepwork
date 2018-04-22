import shell from "shelljs";
const path = require("path");

const rootdir = path.resolve();
export const Code = function() {
	this.rootdir = rootdir;
}


Code.prototype.pushCode = function() {
	const cmd_str = "cd " + this.rootdir + "; git reset --hard HEAD; git pull origin master;";
	shell.exec(cmd_str);
	console.log(cmd_str);
}

Code.prototype.getRoutes = function() {
	const self = this;
	const prefix = "/code";
	const routes = [
	{
		path: prefix + "/push_code",
		method: "all",
		action: "pushCode",
	},

	];

	return routes;
}

export default new Code();
