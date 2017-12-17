-- title: data source
-- author: xiaoyao
-- date: 2017-9-28


local orm = require("orm/orm")

local data_source_model = require("model/data_source")

-- user 表
local site_data_source = common.inherit(orm)

-- define table
site_data_source:tablename("site_data_source")
site_data_source:addfield("site_data_source_id", "number")
site_data_source:addfield("data_source_id", "number")
site_data_source:addfield("data_source_name", "string")
site_data_source:addfield("site_id", "number")
site_data_source:addfield("username", "string")
site_data_source:addfield("sitename", "string")
site_data_source:addfield("visibility", "string")
site_data_source:addfield("project_id", "number")
site_data_source:addfield("project_name", "string")
site_data_source:addfield("root_path", "string")
site_data_source:addfield("last_commit_id", "string")
site_data_source:addfield("last_commit_id_update_time", "string")
site_data_source:addfield("last_commit_id_update_time", "number")
site_data_source:addfield("last_commit_id_update_flag", "number")
site_data_source:addfield("is_default", "number")
site_data_source:addfield("create_time", "string")
site_data_source:addfield("update_time", "string")


function site_data_source:_create_gitlab_project(params)
	if not params.visibility or not params.project_name or not params.token or not params.api_base_url then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local res = util.get_url({
		url = params.api_base_url .. "/projects",
		method = "GET",
		headers = {['PRIVATE-TOKEN'] = params.token},
		params = {
			search=params.project_name,
			owned=true,
		},
	})

	if not res or res.status_code ~= 200 then
		log(res)
		return errors:wrap(errors:new("获取项目信息失败"), params)
	end
	
	data = res.data or {}

	for _, project in ipairs(data) do
		if string.lower(project.name) == string.lower(params.project_name) then
			return errors:wrap(nil, project)
		end
	end

	-- 不存创建项目
	res = util.get_url({
		url = params.api_base_url .. "/projects",
		method = "POST",
		headers = {['PRIVATE-TOKEN'] = params.token},
		data = {
			name = params.project_name, 
			request_access_enabled = true, 
			visibility = params.visibility,
		},
	})

	if not res or res.status_code ~= 201 then
		log(res)
		return errors:wrap(errors:new("创建项目失败"), params)
	end
	
	local project = res.data
	--local webhook = "http://dev.keepwork.com/api/wiki/models/data_source/gitlabWebhook"
	---- 创建webhook
	--res = util.get_url({
		--url = params.api_base_url .. "/projects/" .. tostring(project.id) .. "/hooks",
		--method = "POST",
		--headers = {['PRIVATE-TOKEN'] = params.token},
		--data = {
			--push_events = true,
			--enable_ssl_verification = false,
			--url = webhook_url,
		--}
	--})

	--if not res or res.status_code ~= 201 then
		--return errors:wrap(errors:new("创建项目回调失败"), params)
	--end

	return errors:wrap(nil, project)
end

-- 创建站点数据源
function site_data_source:create_site_data_source(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local data = self:find_one({username=params.username, sitename=params.sitename})
	if data then
		return errors:wrap("站点数据源已存在")
	end

	local data_source_name = params.data_source_name
	local data_source = nil
	
	if data_source_name then
		data_source = data_source_model:get_by_name({username=params.username, data_source_name=data_source_name}).data
	else
		data_source = data_source_model:get_default_by_username({username=params.username}).data
	end
	
	if not data_source then
		return errors:wrap(errors:new("没有默认数据源"), params)
	end
	
	local project_params = {}
	project_params.visibility = params.visibility or "public"
	project_params.project_name = params.project_name or (const.DATA_SOURCE_PROJECT_NAME_PREFIX .. string.lower(params.sitename))
	--project_params.data_source_name = data_source.data_source_name
	project_params.token = data_source.token
	project_params.api_base_url = data_source.api_base_url

	local result = nil
	if data_source.type == const.DATA_SOURCE_TYPE_GITLAB then
		result = self:_create_gitlab_project(project_params)
	end

	local project = result.data
	if not project then
		return ret
	end

	local err = self:insert({
		username = params.username,
		sitename = params.sitename,
		data_source_id = data_source.data_source_id,
		data_source_name = data_source.data_source_name,
		visibility = project_params.visibility,
		project_id = project.id,
		project_name = project_params.project_name,
		is_default = params.is_default,
	})

	local data = self:find_one({username=params.username, sitename=params.sitename})
	self:_copy_data_source(data, data_source)

	return errors:wrap(err, data)
end

function site_data_source:create_default_site_data_source(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = {
		username = params.username,
		sitename = const.DEFAULT_DATA_SOURCE_PUBLIC_PROJECT_NAME,
		project_name = const.DEFAULT_DATA_SOURCE_PUBLIC_PROJECT_NAME,
		is_default = 1,
		visibility = "public",
	}

	local ret = self:create_site_data_source(data)
	if ret:is_error() then
		return ret
	end

	data.is_default = 0
	data.visibility = "private"
	data.sitename = const.DEFAULT_DATA_SOURCE_PRIVATE_PROJECT_NAME
	data.project_name = const.DEFAULT_DATA_SOURCE_PRIVATE_PROJECT_NAME

	local ret = self:create_site_data_source(data)
	if ret:is_error() then
		return ret
	end

	return errors:wrap(nil)
end

function site_data_source:get_default_site_data_source(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({username=params.username, is_default=1})

	if not data then
		self:create_default_site_data_source(params)
		data = self:find_one({username=params.username, is_default=1})
	end

	self:_copy_data_source(data)

	return errors:wrap(nil, data)
end

function site_data_source:get_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data_source_list = data_source_model:get_by_username({username=params.username}).data

	local site_data_source_list = self:find({username=params.username})

	for _, site_data_source_x in ipairs(site_data_source_list) do
		for _, data_source_x in ipairs(data_source_list or {}) do
			if site_data_source_x.data_source_name == data_source_x.data_source_name then
				self:_copy_data_source(site_data_source_x, data_source_x)
			end
		end
	end

	return errors:wrap(nil, site_data_source_list)
end

function site_data_source:get_by_name(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({username=params.username, sitename=params.sitename})

	self:_copy_data_source(data)	
	return errors:wrap(nil, data)
end

-- 通过id获取站点数据源
function site_data_source:get_by_id(params)
	if not params.site_data_source_id then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({site_data_source_id=params.site_data_source_id})
	self:_copy_data_source(data)

	return errors:wrap(nil, data)
end

function site_data_source:_copy_data_source(site_data_source_x, data_source_x)
	if not site_data_source_x then
		return 
	end

	if not data_source_x then
		data_source_x = data_source_model:get_by_name({
			username=site_data_source_x.username,
			data_source_name = site_data_source_x.data_source_name,
		}).data
		if not data_source_x then
			return
		end
	end

	site_data_source_x.data_source_id = data_source_x.data_source_id
	site_data_source_x.type = data_source_x.type
	site_data_source_x.external_user_id = data_source_x.external_user_id
	site_data_source_x.external_username = data_source_x.external_username
	site_data_source_x.token = data_source_x.token
	site_data_source_x.api_base_url = data_source_x.api_base_url
	site_data_source_x.raw_base_url = data_source_x.raw_base_url
	return
end

-- 通过id修改站点数据源
function site_data_source:update_by_id(params)
	if not params.site_data_source_id then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:update({site_data_source_id=params.site_data_source_id}, params)

	return errors:wrap(err)
end

return site_data_source






















