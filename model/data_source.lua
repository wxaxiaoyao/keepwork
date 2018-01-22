-- title: data source
-- author: xiaoyao
-- date: 2017-9-28


local orm = nws.gettable("nws.orm")
local gitlab = nws.import("helper/gitlab")

-- user 表
local data_source = nws.inherit(orm)
-- define table
data_source:tablename("data_source")
data_source:addfield("data_source_id", "number")
data_source:addfield("username", "string")
data_source:addfield("data_source_name", "string")
data_source:addfield("type", "string")
data_source:addfield("token", "string")
data_source:addfield("api_base_url", "string")
data_source:addfield("raw_base_url", "string")
data_source:addfield("external_user_id", "number")
data_source:addfield("external_username", "string")
data_source:addfield("external_password", "string")
data_source:addfield("project_name", "string")
data_source:addfield("project_id", "number")
data_source:addfield("visibility", "string")
data_source:addfield("is_default", "number")
data_source:addfield("last_commit_id", "string")
data_source:addfield("last_commit_id_update_time", "number")
data_source:addfield("last_commit_id_update_flag", "number")
data_source:addfield("create_time", "string")
data_source:addfield("update_time", "string")

local l_admin_token = nws.config.gitlab.token
local l_gitlab_host = "http://" .. nws.config.gitlab.host
local l_default_project_name = "keepworkdatasource"
local util = nws.util

function data_source:get_system_default_git()
	--return {
		--project_name = "keepworkdatasource",
		--project_id = 4980659,
		--external_username = "wxaxiaoyao",
		--external_user_id = 1212689,
		--data_source_name = "keepwork",
		--username = "keepwork",
		--api_base_url = "https://gitlab.com/api/v4",
		--raw_base_url = "https://gitlab.com",
		--type = "gitlab",
		--token = "Ed9S7hSfiruewMR-jitR",
		--is_default = 1,
	--}
	return {
		project_name = "keepworkdatasource",
		project_id = 5112836,
		external_username = "keepwork",
		external_user_id = 1915792,
		data_source_name = "keepwork",
		username = "keepwork",
		api_base_url = "https://gitlab.com/api/v4",
		raw_base_url = "https://gitlab.com",
		type = "gitlab",
		--token = "9x94xLa-CZPH9Da5h5kd",
		token = "keepwork",
		is_default = 1,
		is_proxy = 1,
	}
end

function data_source:get_default_git_by_username(params)
	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	local data = self:find_one({username=params.username, is_default=1})
	if not data then
		--return (errors:wrap(errors.NOT_FOUND))
		data = data_source:get_system_default_git()
	end

	local git = nil
	if data.type == "gitlab" then
		git = gitlab:init(data)
	end

	return nil, git
end

function data_source:create_gitlab_project(params)
	if not params.token or not params.api_base_url then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	params.visibility = params.visibility or "private"
	params.project_name = l_default_project_name
	local res = util.get_url({
		url = params.api_base_url .. "/projects",
		method = "GET",
		headers = {['PRIVATE-TOKEN'] = params.token},
		data = {
			search=params.project_name,
			owned=true,
		},
	})

	if not res or res.status_code ~= 200 then
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

-- 创建gitlab用户
function data_source:create_gitlab_data_source(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	-- 已存在直接返回
	local _, data = self:get_by_username(params)
	if data and #data ~= 0 then
		return errors:wrap(nil, data)
	end

	nws.log("用户数据源不存在， 创建用户数据源")
	local gitlab_user_params = {}
	gitlab_user_params.username = params.username
	gitlab_user_params.name = gitlab_user_params.username
	gitlab_user_params.email = gitlab_user_params.name .. '@paraengine.com'
	-- 使用keepwork账号密码
	gitlab_user_params.password = params.password or tostring(os.time())
	gitlab_user_params.skip_confirmation = true

	local api_base_url = l_gitlab_host .. "/api/v4"
	local raw_base_url = l_gitlab_host 
	--gitlab:init({
		--api_base_url = api_base_url,
		--raw_base_url = raw_base_url,
		--token = l_admin_token,
	--})

	local gitlab_user = {
		username = params.username,
		type = const.DATA_SOURCE_TYPE_GITLAB,
		data_source_name = const.DEFAULT_DATA_SOURCE_NAME,
		token = nil,
		api_base_url = api_base_url,
		raw_base_url = raw_base_url,
		external_user_id = nil,
		external_username = gitlab_user_params.username,
		external_password = gitlab_user_params.password,
		is_default = 1,
	}

	nws.log(gitlab_user)
	nws.log("检测用户信息...")
	-- 拉取用户信息
	local res = util.get_url({
		url = api_base_url .. "/users",
		method = "GET",
		headers = {['PRIVATE-TOKEN']= l_admin_token},
		data = {username=params.username},
	})

	if not res or res.status_code ~= 200 then
		return errors:wrap(errors:new("get gitlab user info error:".. tostring(res.status_code)))
	end

	data = res.data or {}

	if #data == 0 then
		nws.log("gitlab用户不存在，创建gitlab用户")
		-- 不存在创建用户
		res = util.get_url({
			url = api_base_url .. "/users",
			method = "POST",
			headers = {['PRIVATE-TOKEN']= l_admin_token},
			data = gitlab_user_params,
		})
		if not res or res.status_code ~= 201 then
			return errors:wrap(errors:new("create gitlab user error"), res)
		end
		gitlab_user.external_user_id = res.data.id
	else
		nws.log("gitlab用户已存在:")
		nws.log(data[1])
		-- 存在获取用户id
		gitlab_user.external_user_id = data[1].id
	end

	nws.log("检测用户token信息...")
	-- 检测token
	res = util.get_url({
		url=api_base_url .. "/users/" .. tostring(gitlab_user.external_user_id) .. "/impersonation_tokens",
		method = "GET",
		headers = {['PRIVATE-TOKEN']= l_admin_token},
	})
	if not res or res.status_code ~= 200 then
		return errors:wrap(errors:new("get gitlab user token error"), res)
	end
	local tokens = res.data or {}
	for _, token in ipairs(tokens) do
		if not token.revoked and token.active then
			gitlab_user.token = token.token
			break
		end
	end

	if not gitlab_user.token then
		res = util.get_url({
			url=api_base_url .. "/users/" .. tostring(gitlab_user.external_user_id) .. "/impersonation_tokens",
			method = "POST",
			headers = {['PRIVATE-TOKEN']= l_admin_token},
			data = {
				["name"] = "keepwork", 
				["expires_at"] = "2222-12-12", 
				["scopes"]= {"api", "read_user"}
			},
		})
		if not res or res.status_code ~= 201 then
			return errors:wrap(errors:new("create user token errors"), res)
		end
		gitlab_user.token = res.data.token
	end

	local ret = self:create_gitlab_project(gitlab_user)
	if not ret.data then
		return ret
	end

	gitlab_user.project_id = ret.data.id
	gitlab_user.preject_name = ret.data.name or l_default_project_name

	local err = self:insert(gitlab_user)

	return errors:wrap(err)
end

-- 增改gitlab数据源
function data_source:set_gitlab_data_source(params)
	if not params.data_source_name or not params.token or not params.username or not params.api_base_url or not params.raw_base_url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	params.project_name = l_default_project_name
	params.visibility = params.visibility or "private"
	gitlab:init(params)
	local err, git_user = gitlab:get_user()
	if err then
		return (errors:wrap(err))
	end
	
	local err, git_pro = gitlab:create_project(params)
	if err then
		return (errors:wrap(err))
	end
	
	params.external_user_id = git_user.id
	params.external_username = git_user.username
	params.project_id = git_pro.id
	params.type = params.type or const.DATA_SOURCE_TYPE_GITLAB

	local err = self:upsert({username = params.username, data_source_name=params.data_source_name}, params)
	return err
end

-- 增改github数据源
function data_source:set_github_data_source(params)
	if not params.data_source_name or not params.token or not params.username or not params.api_base_url or not params.raw_base_url then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	params.type = params.type or const.DATA_SOURCE_TYPE_GITHUB
	local res = util.get_url({
		url = params.api_base_url .. "/user",
		method = "GET",
		headers = {["User-Agent"]="Satellizer",["Accept"]="application/vnd.github.full+json", ["Authorization"]= " token " .. params.token},
	})

	if not res or res.status_code ~= 200 then
		return errors:wrap("get gitlab user error", res)
	end
	
	local data = res.data
	params.external_user_id = data.id
	params.external_username = data.login

	local err = self:upsert({username = params.username, data_source_name = params.data_source_name}, params)
	return errors:wrap(err)
end

-- 设置数据源
function data_source:set_data_source(params)
	if params.type == const.DATA_SOURCE_TYPE_GITLAB then
		return self:set_gitlab_data_source(params)
	elseif params.type == const.DATA_SOURCE_TYPE_GITHUB then
		return self:set_github_data_source(params)
	end
	
	return errors:wrap(errors.PARAMS_ERROR)
end

-- 获取记录
function data_source:get_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find({username=params.username})

	return nil, data
end

-- 获取默认数据源
function data_source:get_default_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({username=params.username, is_default = 1})
	if not data then
		data = data_source:get_system_default_git()
	end
	--if not data then
		--self:create_gitlab_data_source(params)
		--data = self:find_one({username=params.username, is_default = 1})
	--end

	return nil, data
end

-- 获取用户指定的数据源
function data_source:get_by_name(params)
	if not params.username or not params.data_source_name then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({username=params.username, data_source_name=params.data_source_name})

	return errors:wrap(nil, data)
end

-- 获取数据源记录
function data_source:get(params)
	local data = self:find(params)

	return errors:wrap(nil, data)
end

return data_source
