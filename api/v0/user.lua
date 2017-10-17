
local user = commonlib.inherit()

local convert_model = require("model/convert")
local user_model = require("model/user")
local user_active_model = require("model/user_active")
local site_model = require("model/site")
local site_data_source_model = require("model/site_data_source")
local vip_model = require("model/vip")
local fans_model = require("model/fans")

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

	userinfo = convert_model.user_new_to_old(userinfo)
	userinfo.vipInfo = convert_model.vip_new_to_old(vip_info)


	-- 生成token
	local token = util.encodeJWT({username=userinfo.username}, nil, 3600 * 100)

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
	local token = util.encodeJWT({username=userinfo.username}, nil, 3600 * 100)

	-- 数据格式转换
	userinfo = convert_model.user_new_to_old(userinfo)
	return errors:wrap(nil, {token=token, userinfo=userinfo})
end

function user:updateUserInfo(params, req, resp)
	params = convert_model.user_old_to_new(params)

	return user_model:update_by_username(params)
end

function user:changepw(params, req, resp)
	local payload = req.payload

	if not payload or not payload.username or not params.oldpassword or not params.newpassword then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	return user_model:modify_password({
		username = payload.username,
		oldpassword = params.oldpassword,
		newpassword = params.newpassword,
	})
end

function user:getDetailByName(params)
	local userinfo = user_model:get_by_username(params).data
	
	if not userinfo then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local date = commonlib.get_date()
	local year = os.date("%Y")
	local activeObj = user_active_model:get_year_data_by_username({username=userinfo.username, year=year}).data
	activeObj = convert_model.active_new_to_old(activeObj)
	local list = site_model:find({username=userinfo.username, site_type = const.SITE_TYPE_ORGANIZATION}) or {}
	local selfOrganizationObj = {total = #list, siteList = list}
	local joinOrganizationObj = {total = 0, siteList = {}}
	local hotSiteObj = {total = 0, siteList = {}}
	local allSiteList = site_model:get_by_username({username=userinfo.username}).data
	local fansObj = fans_model:get_by_username({username=userinfo.username}).data
	local followUserObj = fans_model:get_by_fans_username({fans_username=userinfo.username}).data
	local followSiteObj = {}
	return errors:wrap(nil, {
		userinfo = convert_model.user_new_to_old(userinfo),
		activeObj = activeObj,
		selfOrganizationObj = selfOrganizationObj,
		joinOrganizationObj = joinOrganizationObj,
		hotSiteObj = hotSiteObj,
		allSiteList = allSiteList,
		fansObj = {total = fansObj.total, userList = fansObj.list},
		followObj = {followUserObj = followUserObj, followSiteObj = followSiteObj},
		trendsObj = {},
	})
end

return user
