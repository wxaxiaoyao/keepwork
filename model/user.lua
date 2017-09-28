-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = require("orm/orm")
-- user 表
local user = commonlib.inherit(orm)
user:tablename("user")

--function user:ctor()
	--self:tablename("user")

	--self:addfield("userId", "number")
	--self:addfield("username","string")
	--self:addfield("password","string")
	--self:addfield("email","string")
	--self:addfield("cellphone","string")
	--self:addfield("nickname","string")
	--self:addfield("portrait","string")
	--self:addfield("sex","string")
	--self:addfield("desc", "string")
	--self:addfield("roleId", "number")
	--self:addfield("createTime", "string")
	--self:addfield("updateTime", "string")
--end


-- 删除用户
function user:delete_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local ok, msg = self:delete({username=params.username})
	if ok == nil then
		return errors:wrap(errors:new(msg))
	end

	return errors:wrap(nil)
end

-- 通过用户名
function user:get_by_username(params)
	if not params or not params.username then
		return errors:wrap(errors.PARAMS_ERROR, params)
	end

	local data = self:find_one({username=params.username})

	if data then
		data.password = nil
	end

	return errors:wrap(nil, data)
end

-- 修改用户信息
function user:set_by_username(params)
	if not params or not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	--params.password = nil
	--params.roleId = nil

	local ok, msg = self:update({username=params.username}, params)

	if ok == nil then
		return errors:wrap(errors:new(err))
	end

	return errors:wrap(nil)
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

	local ret = self:get_by_username(params).data
	if ret then
		return errors:wrap(errors:new("用户已存在"), params)
	end

	local ok, msg = self:insert(params)
	if ok == nil then
		return errors:wrap(errors:new(msg))
	end

	return errors:wrap(nil)
end

return user
