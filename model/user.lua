local mysql_table = require("orm/mysql_table")

-- user 表
local user = inherit(mysql_table)

function user:ctor()
	self:tablename("user")

	self:addfield("userId", "number")
	self:addfield("username","string")
	self:addfield("password","string")
	self:addfield("email","string")
	self:addfield("cellphone","string")
	self:addfield("nickname","string")
	self:addfield("portrait","string")
	self:addfield("sex","string")
	self:addfield("desc", "string")
	self:addfield("roleId", "number")
	self:addfield("createTime", "string")
	self:addfield("updateTime", "string")
end


function user:test()
	local ret = self:upsert({username="xiaoyao"},{
		username="xiaoyao",
		password="wuxiangan",
		email="765485868@qq,cin",
		nickname="逍遥"
	})
	console(ret)
end


return user
