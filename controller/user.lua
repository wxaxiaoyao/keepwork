
local controller = nws.gettable("nws.controller")
--  创建test控制器
local user = controller:new("user")

local user_model = nws.import("model/user")
local data_source_model = nws.import("model/data_source")
local page_model = nws.import("model/page")
local visit_history_model = nws.import("model/visit_history")
local favorite_model = nws.import("model/favorite")
local fans_model = nws.import("model/fans")

-- 是否登陆
function user:is_login(ctx) 
	if ctx.username then
		return (errors:wrap(nil, true))
	end
	return (errors:wrap(nil, false))
end

--function user:login_register(ctx) 
	--local params = ctx.request:get_params()
	--if not params.username or not params.password then
		--return (errors:wrap(errors.PARAMS_ERROR, params))
	--end
--end

-- 用户登录
function user:login(ctx)
	local params = ctx.request:get_params()
	if not params.username or not params.password then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	local err, userinfo = user_model:login(params)
	if not userinfo then
		return (errors:wrap("用户名密码错误"))
	end

	-- 数据源相关信息
	local err, default_data_source = data_source_model:get_default_by_username(params)
	userinfo.default_data_source = default_data_source

	-- 生成token
	local token = nws.util.encode_jwt({user_id = userinfo.user_id, username=userinfo.username}, nws.config.token.secret, nws.config.token.expire)

	nws.log(token)
	return (errors:wrap(nil, {token=token, userinfo=userinfo}))
end


-- 用户注册
function user:register(ctx)
	local params = ctx.request:get_params()
	--local params = req:get_params()

	if not params.username or not params.password then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err, userinfo = user_model:register({username=params.username, password=params.password})
	if not userinfo then
		return (errors:wrap(err))
	end
	
	-- 数据源相关信息
	local err, default_data_source = data_source_model:get_default_by_username(params)
	userinfo.default_data_source = default_data_source

	-- 生成token
	local token = nws.util.encode_jwt({user_id = userinfo.user_id, username=userinfo.username}, nws.config.token.secret, nws.config.token.expire)

	-- 数据格式转换
	userinfo = convert_model.user_new_to_old(userinfo)
	return errors:wrap(nil, {token=token, userinfo=userinfo})
end

-- 获取已认证的用户信息
function user:get(ctx)
	local username = ctx.username
	if not username then
		return (errors:wrap(errors.NOT_PRIVILEGES))
	end
	
	local err, userinfo = user_model:get_by_username({username=username})
	if not userinfo then
		return (errors:wrap(err))
	end

	local err, default_data_source = data_source_model:get_default_by_username({username=userinfo.username})
	userinfo.default_data_source = default_data_source

	return (errors:wrap(nil, userinfo))
end

-- 更新用户信息
function user:update_by_username(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()
	params.username = username

	local err, data = user_model:update_by_username(params)

	return (errors:wrap(err, data))
end

function user:changepw(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()
	params.username = username

	if not params.username or not params.oldpassword or not params.newpassword then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = user_model:modify_password(params)

	return (errors:wrap(err))
end

-- 通过用户名获取用户信息
function user:get_by_username(ctx)
	local params = ctx.request:get_params()

	if not params.username then
		return (errors:wrap(PARAMS_ERROR))
	end

	local err, userinfo = user_model:get_by_username(params)

	return (errors:wrap(err , userinfo))
end

return user
