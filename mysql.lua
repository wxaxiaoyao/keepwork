luasql = require "luasql.mysql"

env = luasql.mysql()

conn = env:connect("keepwork", "root", "wuxiangan", "121.14.117.251", 3306)

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
