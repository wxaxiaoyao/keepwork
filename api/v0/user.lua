
local user = commonlib.inherit()

local convert_model = require("model/convert")
local user_model = require("model/user")
local site_data_source_model = require("model/site_data_source")
local vip_model = require("model/vip")

-- 用户登录
function user:login(req, resp)
	local params = req:get_params()
	if true then
		return resp:send({token="hello world"})
	end
	if not params or not params.username or not params.password then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local userinfo = user_model:login(params).data
	if not userinfo then
		return resp:send(errors:wrap(errors:new("用户名密码错误")))
	end

	-- 数据源相关信息
	--local default_site_data_source = site_data_source_model:get_default_site_data_source(params).data
	--local site_data_source_list = site_data_source_model:get_by_username(params).data
	---- vip相关信息
	local vip_info = vip_model:get_by_username(params).data

	--userinfo.defaultSiteDataSource = convert_model.site_data_source_new_to_old(default_site_data_source)
	--userinfo.dataSource = convert_model.list_convert(site_data_source_list, convert_model.site_data_source_new_to_old)
	userinfo.vipInfo = convert_model.vip_new_to_old(vip_info)

	-- 生成token
	local token = util.encodeJWT({username=userinfo.username})

	return resp:send(errors:wrap(nil, {token=token, userinfo=userinfo}))
end


-- 用户注册
function user:register(req, resp)
	local params = req:get_params()

	if not params or not params.username or not params.password then
		ngx_log(params)
		ngx_log(type(params))
		ngx_log(params['username'])
		ngx_log(params.password)
		ngx_log("params error")
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local is_create_data_source = false
	if params.channel == "keepwork" then
		is_create_data_source = true
	end

	local ret = user_model:register({username=params.username, password=params.password,is_create_data_source=is_create_data_source})
	
	local userinfo = ret.data

	if not userinfo then
		ngx_log("register failed")
		return resp:send(ret)
	end
	
	-- 数据源相关信息
	local default_site_data_source = site_data_source_model:get_default_site_data_source(params).data
	local site_data_source_list = site_data_source_model:get_by_username(params).data

	-- vip相关信息
	local vip_info = vip_model:get_by_username(params).data

	-- 生成token
	local token = util.encodeJWT({username=userinfo.username})

	return resp:send(errors:wrap(nil, {token=token, userinfo=userinfo}))
end


return user:new()
