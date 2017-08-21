--logging = require "logging"
logging_file = require 'logging.file'

log_file = logging_file(config.root_dir .. "log.txt")

log = {
	log=log_file,
}

function log:debug(msg)
	self.log:debug(msg)
end


log:debug(ngx.var.uri)

ngx.log(ngx.ERR, "--------------")
