-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = require("orm/orm")

local data_source_db = require("model/data_source")
local site_data_source_db = require("model/site_data_source")

-- user 表
local user = commonlib.inherit(orm)

--function user:ctor()
user:tablename("user")
user:addfield("user_id", "number")
user:addfield("username","string")
user:addfield("password","string")
user:addfield("email","string")
user:addfield("cellphone","string")
user:addfield("nickname","string")
user:addfield("portrait","string")
user:addfield("sex","string")
user:addfield("desc", "string")
user:addfield("role_id", "number")
user:addfield("create_time", "string")
user:addfield("update_time", "string")
--end


function user:test(params)
	return self:count()
end

-- 删除用户
function user:delete_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local err = self:delete({username=params.username})
	return errors:wrap(err)
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

	local err = self:update({username=params.username}, params)

	return errors:wrap(err)
end

-- 注册接口
function user:register(params)
	if not params or not params.username or not params.password then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	params.username = string.lower(params.username)
	if #params.username < 4 or #params.username > 30 then
		return errors:wrap(errors:new("用户名不合法"))
	end

	if not string.match(params.username, "^[%w]+$") then
		return errors:wrap(errors:new("用户名只能由字母和数字组成"))
	end

	local ret = self:get_by_username(params).data
	if ret then
		return errors:wrap(errors:new("用户已存在", params))
	end

	local user_params = {
		username = params.username,
		password = util.md5(params.password),
	}

	local err = self:insert(user_params)
	if err then
		return errors:wrap(err)
	end

	local userinfo = self:find_one({username=params.username})
	if not userinfo then
		return errors:wrap(errors:new("获取用户信息失败"))
	end

	-- 是否创建数据源
	if not params.is_create_data_source then
		return errors:wrap(nil, userinfo)
	end

	-- 创建git 用户
	local ret = data_source_db:create_inner_gitlab_data_source(params)

	if ret:is_error() then
		--self:delete({username=params.username})
		return errors:wrap("创建数据源信息失败", userinfo)
	end

	-- 创建默认数据源
	local ret = site_data_source_db:create_default_site_data_source(params)
	if ret:is_error() then
		--self:delete({username=params.username})
		return errors:wrap("创建数据源信息失败", userinfo)
	end

	return errors:wrap(nil, userinfo)
end


-- 用户登录
function user:login(params)
	if not params.username or not params.password then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local username = params.username
	local password = util.md5(params.password)
	local userinfo = nil

	if (string.find(username, '@')) then
		userinfo = self:find_one({email=username, password=password})
	elseif (string.match(username,"^%d*$")) then
		userinfo = self:find_one({cellphone=username, password=password})
	else
		userinfo = self:find_one({username=string.lower(username), password=password})
	end

	return errors:wrap(nil, userinfo)
end

return user
