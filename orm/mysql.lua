local luasql = require "luasql.mysql"

local mysql = {
	DEFAULT_LIMIT=200, -- 默认页大小

	-- 关键字
	LIMIT = "$limit",	
	OFFSET = "$offset",
	OR = "$or",
	AND = "$and",
}

function mysql:init(config)
	config = config or {}
	config.database = config.database or "keepwork"
	config.username = config.username or "wuxiangan"
	config.password = config.password or "wuxiangan"
	config.host = config.host or "127.0.0.1"
	config.port = config.port or 3306

	self.env = luasql.mysql()
	self.conn = env:connect(config.database, config.username, config.password, config.host, config.port)
end


function mysql:deinit()
	self.conn:close()
	self.env:close()
end



--conn:execute("SET NAMES UTF8")

--cur = conn:execute("select * from user")

--row = cur:fetch({}, "a")

--while row do
	--var = string.format("%s %s", row.username, row.password)

	----ngx.say(var)
	--print(var)

	--row = cur:fetch(row, "a")
--end



return mysql
