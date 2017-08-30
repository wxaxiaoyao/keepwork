local luasql = require "luasql.mysql"

local mysql = {
	DEFAULT_LIMIT=200, -- 默认页大小

	-- 关键字
	LIMIT = "$limit",	
	OFFSET = "$offset",
	OR = "$or",
	AND = "$and",
	ON = "$on",


	isInited=false,
}

-- 日志输出
local function log(msg) 
	--print(msg)
end

function mysql:init(config)

	if self.isInited then
		return
	end

	config = config or {}
	config.database = config.database or "keepwork"
	config.username = config.username or "wuxiangan"
	config.password = config.password or "wuxiangan"
	config.host = config.host or "127.0.0.1"
	config.port = config.port or 3306

	self.log = config.log or log

	self.env = luasql.mysql()
	self.conn = self.env:connect(config.database, config.username, config.password, config.host, config.port)
	self.conn:execute("SET NAMES UTF8")

	self.isInited = true
end


function mysql:deinit()
	if self.isInited then
		self.conn:close()
		self.env:close()
	end
end


function mysql:execute(sql_str)
	return self.conn:execute(sql_str)
end

mysql:init()
--cur = conn:execute("select * from user")

--row = cur:fetch({}, "a")

--while row do
	--var = string.format("%s %s", row.username, row.password)

	----ngx.say(var)
	--print(var)

	--row = cur:fetch(row, "a")
--end



return mysql
