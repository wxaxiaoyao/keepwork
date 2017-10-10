local website = commonlib.inherit()

local site_model = require("model/site")
local user_model = require("model/user")
local site_data_source_model = require("model/site_data_source")
local convert_model = require("model/convert")

function website:getByName(params, req, resp)
	--local params = req:get_params()

	if not params or not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data =  site_model:get_by_name({username=params.username, sitename=params.sitename})
	
	return data
	--return resp:send(data)
end

function website:upsert(params, req, resp)
	--local params = req:get_params()
	params = convert_model.site_old_to_new(params)

	local site_data_source = site_data_source_model:get_default_site_data_source({
		username = params.username,
	}).data

	if params.isolate_data_source then
		site_data_source = site_data_source_model:create_site_data_source({
			username = params.username,
			sitename = params.sitename,
		}).data
	end

	if not site_data_source then
		return errors:wrap("无数据源可用")
	end

	log(site_data_source)

	params.site_data_source_id = site_data_source.site_data_source_id

	local result = site_model:create(params)
	if result:is_error() then
		return result
	end
	
	local site_info = result.data
	site_info = convert_model.site_new_to_old(site_info)
	site_info.dataSource = convert_model.site_data_source_new_to_old(site_data_source)
	return errors:wrap(nil, site_info)
	--return resp:send(result)
end

function website:getAllByUsername(params, req, resp)
	local result = site_model:get_by_username(params)
	if result:is_error() then
		return result
	end

	local list = result.data
	for index, obj in ipairs(list) do
		list[index] = convert_model.site_new_to_old(obj)
	end

	return errors:wrap(nil, list)
end

function website:deleteById(params, req, resp)
	if not params or not params.websiteId then
		return errors:wrap(errors.PARAMS_ERROR, params)
	end

	return site_model:delete_site({site_id=params.websiteId})
end

function website:getDetailInfo(params, req, resp)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	-- 获取用户信息
	local userinfo = user_model:get_by_username({username=params.username}).data
	if not userinfo then
		return errors:wrap(errors.NOT_FOUND)
	end

	-- 获取站点信息
	local siteinfo = site_model:get_by_name({username=params.username, sitename=params.sitename}).data
	if not siteinfo then
		return errors:wrap(errors.NOT_FOUND)
	end

	-- 获取所有站点数据源  可改进成获取该站点数据源
	local data_source_info = site_data_source_model:get_by_id({site_data_source_id=siteinfo.site_data_source_id}).data


	-- 数据格式转换
	userinfo = convert_model.user_new_to_old(userinfo)
	siteinfo = convert_model.site_new_to_old(siteinfo)
	data_source_info = convert_model.site_data_source_new_to_old(data_source_info)
	userinfo.dataSource = {data_source_info}	

	return errors:wrap(nil, {userinfo=userinfo, siteinfo=siteinfo})
end

function website:updateByName(params, req, resp)
	local params = convert_model.site_old_to_new(params)

	if not params.username or not params.sitename or params.username ~= req.payload.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	return site_model:set_by_name(params)	
end

return website



