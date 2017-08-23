local mysql_table = require("orm/mysql_table")

-- user 表
local user = inherit(mysql_table)
user.table_name = "user"

function user:ctor()
	print("user:ctor()")

	self:tablename("user")

	self:addfield("userId", "number")
	self:addfield("username","string")
	self:addfield("password","string")
	self:addfield("desc", "string")
	self:addfield("createTime", "string")
	self:addfield("updateTime", "string")
end

return user
