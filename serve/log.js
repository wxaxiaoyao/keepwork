import log4js from "log4js";

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


export const getLogger = function(category) {
	return log4js.getLogger(category || 'default');
}

export default getLogger();
