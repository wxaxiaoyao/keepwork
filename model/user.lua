local mysql_table = require("orm/mysql_table")

-- user 表
local user = commonlib.inherit(mysql_table)

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
	commonlib.console(ret)
end


-- 通过用户名
function user:get_by_username(params)
	if not params or not params.username then
		return errors:wrap(errors.PARAMS_ERROR, params)
	end

	local data = self:find_one({username=params.username})

	return errors:wrap(nil, data)
end

-- 注册接口
function user:register(params)
	if not params or not params.username or not params.password then
		return errors:wrap(errors.PARAMS_ERROR, params)
	end
	
	params.username = string.lower(params.username)
	if #params.username < 4 or #params.username > 30 then
		return errors:wrap(errors:new("用户名不合法"), params)
	end

	if not string.match(params.username, "^[%w]+$") then
		return errors:wrap(errors:new("用户名只能由字母和数字组成"), params)
	end

	if self:get_by_username(params) then
		return errors:wrap(errors:new("用户已存在"), params)
	end

	local ret = self:insert(params)
	
	return ret
end

local function test_local()
	commonlib.console("hello world")
end

return commonlib.export(user:new(), {
	"register"
})
