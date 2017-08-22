luasql = require "luasql.mysql"

env = luasql.mysql()

conn = env:connect("keepwork", "wuxiangan", "wuxiangan", "127.0.0.1", 3306)

conn:execute("SET NAMES UTF8")

cur = conn:execute("select * from user")

row = cur:fetch({}, "a")

while row do
	var = string.format("%s %s", row.username, row.password)

	ngx.say(var)

	row = cur:fetch(row, "a")
end

conn:close()
env:close()

ngx.say("helle world")
