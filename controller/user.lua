
local controller = nws.gettable("nws.controller")
--  创建test控制器
local user = controller:new("user")

--local convert_model = require("model/convert")
local user_model = nws.import("model/user")
local data_source_model = nws.import("model/data_source")
--local user_active_model = require("model/user_active")
--local site_model = require("model/site")
--local site_data_source_model = require("model/site_data_source")
--local vip_model = require("model/vip")
--local fans_model = require("model/fans")

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
	local default_data_source = data_source_model:get_default_by_username(params).data
	userinfo.default_data_source = default_data_source

	-- 生成token
	local token = nws.util.encode_jwt({user_id = userinfo.user_id, username=userinfo.username}, nil, 3600 * 100)

	--nws.log(token)
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
	local default_data_source = data_source_model:get_default_by_username(params).data
	userinfo.default_data_source = default_data_source

	-- 生成token
	local token = nws.util.encode_jwt({user_id = userinfo.user_id, username=userinfo.username}, nil, 3600 * 100)

	-- 数据格式转换
	userinfo = convert_model.user_new_to_old(userinfo)
	return errors:wrap(nil, {token=token, userinfo=userinfo})
end

function user:get(ctx)
	local token = ctx.token
	if not token then
		return (errors:wrap(errors.NOT_PRIVILEGES))
	end
	
	local err, userinfo = user_model:get_by_username({username=token.username})
	if not userinfo then
		return (errors:wrap(err))
	end

	local default_data_source = data_source_model:get_default_by_username({username=userinfo.username}).data
	userinfo.default_data_source = default_data_source

	return (errors:wrap(nil, userinfo))
end

function user:get_by_username(ctx) 
	local params = ctx.request:get_params()
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

	local date = common.get_date()
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
