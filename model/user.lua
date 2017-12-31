-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = nws.gettable("nws.orm")
--local data_source_db = nws.import("model/data_source")
--local site_data_source_db = nws.import("model/site_data_source")

-- user 表
local user = nws.inherit(orm)

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

-- 用户信息过滤
function user:filter(userinfo)
	return {
		user_id = userinfo.user_id,
		username = userinfo.username,
		email = userinfo.email,
		cellphone = userinfo.cellphone,
		nickname = userinfo.nickname,
		portrait = userinfo.portrait,
		sex = userinfo.sex,
		desc = userinfo.desc,
		create_time = userinfo.create_time,
		update_time = userinfo.update_time,
	}
end

-- 简化用户信息
function user:simplify(userinfo)
	userinfo.password = nil
end

-- 删除用户
function user:delete_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local err = self:delete({username=params.username})
	return err
end

-- 通过用户id
function user:get_by_id(params)
	if not params.user_id then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({user_id=params.user_id})

	if data then
		data.password = nil
	end

	return nil, data
end

-- 通过用户名
function user:get_by_username(params)
	if not params or not params.username then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	local data = self:find_one({username=params.username})

	if data then
		data.password = nil
	end

	return nil, data
end

-- 修改用户信息
function user:set_by_username(params)
	if not params or not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	--params.password = nil
	--params.roleId = nil

	local err = self:update({username=params.username}, params)

	return err
end

-- 注册接口
function user:register(params)
	if not params or not params.username or not params.password then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	params.username = string.lower(params.username)
	if #params.username < 4 or #params.username > 30 then
		return errors:wrap("用户名不合法")
	end

	if not string.match(params.username, "^[%w]+$") then
		return errors:wrap("用户名只能由字母和数字组成")
	end

	local ret, data = self:get_by_username(params)
	if data then
		return (errors:wrap("用户已存在", data))
	end

	local user_params = {
		username = params.username,
		password = nws.util.md5(params.password),
	}

	local err = self:insert(user_params)
	if err then
		return errors:wrap(err)
	end

	local userinfo = self:find_one({username=params.username})
	if userinfo then
		user:simplify(userinfo)
	end

	return nil, userinfo
end


-- 用户登录
function user:login(params)
	if not params.username or not params.password then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local username = params.username
	local password = nws.util.md5(params.password)
	local userinfo = nil

	if (string.find(username, '@')) then
		userinfo = self:find_one({email=username, password=password})
	elseif (string.match(username,"^%d*$")) then
		userinfo = self:find_one({cellphone=username, password=password})
	else
		userinfo = self:find_one({username=string.lower(username), password=password})
	end

	if userinfo then
		user:simplify(userinfo)
	end

	return nil, userinfo
end

-- 通过用户名修改用户信息
function user:update_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	params.password = nil
	params.role_id = nil
	params.cellphone = nil
	params.email = nil

	local err, data = self:update({username=params.username}, params)

	return err, data
end

-- 修改用户密码
function user:modify_password(params)
	if not params.username or not params.oldpassword or not params.newpassword then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local data = self:find_one({
		username = params.username,
		password = nws.util.md5(params.oldpassword),
	})

	if not data then
		return (errors:wrap(errors.NOT_FOUND))
	end

	local err = self:update({username=params.username}, {password=nws.util.md5(params.newpassword)})

	return err
end

return user













