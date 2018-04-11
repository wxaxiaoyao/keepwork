const log4js = require("log4js");

log4js.configure({
	appenders: {
		stdout: {
			type:'stdout',
		},
		file: {
			type:'file',
			filename:'log.txt',
		},
	},
	categories: {
		default: {
			//appenders: ['stdout', 'file'], 
			appenders: ['stdout'], 
			level:'debug',
		},
	},
});


exports.getLogger = function(category) {
	return log4js.getLogger(category || 'default');
}

exports.logger = exports.getLogger();
