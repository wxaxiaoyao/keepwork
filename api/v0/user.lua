
local user = commonlib.inherit()

local convert_model = require("model/convert")
local user_model = require("model/user")
local site_data_source_model = require("model/site_data_source")
local vip_model = require("model/vip")

-- 用户登录
function user:login(params, req, resp)
	local params = req:get_params()
	if not params or not params.username or not params.password then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local userinfo = user_model:login(params).data
	if not userinfo then
		return errors:wrap(errors:new("用户名密码错误"))
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

	return errors:wrap(nil, {token=token, userinfo=userinfo})
end


-- 用户注册
function user:register(params, req, resp)
	--local params = req:get_params()

	if not params or not params.username or not params.password then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local is_create_data_source = false
	if params.channel == "keepwork" then
		is_create_data_source = true
	end

	local ret = user_model:register({username=params.username, password=params.password,is_create_data_source=is_create_data_source})
	
	local userinfo = ret.data

	if not userinfo then
		return ret
	end
	
	-- 数据源相关信息
	local default_site_data_source = site_data_source_model:get_default_site_data_source(params).data
	local site_data_source_list = site_data_source_model:get_by_username(params).data

	-- vip相关信息
	local vip_info = vip_model:get_by_username(params).data

	-- 生成token
	local token = util.encodeJWT({username=userinfo.username})

	return errors:wrap(nil, {token=token, userinfo=userinfo})
end


return user:new()
