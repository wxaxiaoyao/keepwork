local website = commonlib.inherit()

local site_model = require("model/site")
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
		ngx_log("------------------")
		ngx_log(result:is_error())
		return result
	end

	local list = result.data
	for index, obj in ipairs(list) do
		list[index] = convert_model.site_new_to_old(obj)
	end

	return errors:wrap(nil, list)
end

return website
