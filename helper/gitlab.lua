
local gitlab = {}
local l_admin_token = nws.config.gitlab.token
local l_gitlab_host = "http://" .. nws.config.gitlab.host
local l_default_project_name = "keepworkdatasource"
local l_api_base_url = l_gitlab_host .. "/api/v4"
local l_raw_base_url = l_gitlab_host 
local util = nws.util

function gitlab:init(config)
	self.api_base_url = config.api_base_url
	self.raw_base_url = config.raw_base_url
	self.token = config.token
	self.project_name = config.project_name or l_default_project_name
	self.project_id = config.project_id

	return self
end

function gitlab:new(config) 
	local obj = {}
	
	setmetatable(obj, self)
	self.__index = self

	obj:init(config)

	return obj
end

function gitlab:get_user() 
	local res = util.get_url({
		url = self.api_base_url .. "/user",
		method = "GET",
		headers = {['PRIVATE-TOKEN'] = self.token},
	})

	if not res or res.status_code ~= 200 then
		return "get gitlab user error"
	end

	return nil, res.data
end

-- 创建gitlab用户
function gitlab:create_user(params)
	if not params.username then
		return "用户名为空"
	end
	
	local gitlab_user_params = {}
	gitlab_user_params.username = params.username
	gitlab_user_params.name = gitlab_user_params.username
	gitlab_user_params.email = gitlab_user_params.name .. '@paraengine.com'
	gitlab_user_params.password = params.password or tostring(os.time())
	gitlab_user_params.skip_confirmation = true

	local res = util.get_url({
		url = self.api_base_url .. "/users",
		method = "GET",
		headers = {['PRIVATE-TOKEN']= self.token},
		data = {username=params.username},
	})

	if not res or res.status_code ~= 200 then
		return "get gitlab user failed"
	end
	
	if res.data and #res.data == 1 then
		return nil, res.data[1]
	end

	print("gitlab用户不存在，创建gitlab用户")
	-- 不存在创建用户
	res = util.get_url({
		url = api_base_url .. "/users",
		method = "POST",
		headers = {['PRIVATE-TOKEN']= self.token},
		data = gitlab_user_params,
	})
	if not res or res.status_code ~= 201 then
		return "create gitlab user failed"
	end

	return nil, res.data
end


-- 或取gitlab user认证token  不存在创建
function gitlab:get_user_token(params)
	if not params.user_id then
		return "user id is null"
	end
	local user_id = params.user_id

	local res = util.get_url({
		url=self.api_base_url .. "/users/" .. tostring(user_id) .. "/impersonation_tokens",
		method = "GET",
		headers = {['PRIVATE-TOKEN']= self.token},
	})

	if not res or res.status_code ~= 200 then
		return "get gitlab user token failed"
	end

	local tokens = res.data or {}
	for _, token in ipairs(tokens) do
		if not token.revoked and token.active then
			return nil, token	
		end
	end

	res = util.get_url({
		url=self.api_base_url .. "/users/" .. tostring(user_id) .. "/impersonation_tokens",
		method = "POST",
		headers = {['PRIVATE-TOKEN']= self.token},
		data = {
			["name"] = "keepwork", 
			["expires_at"] = "2222-12-12", 
			["scopes"]= {"api", "read_user"},
		},
	})
	if not res or res.status_code ~= 201 then
		return "create user token failed"
	end

	return nil, res.data
end

-- 创建项目
function gitlab:create_project(params)
	params.project_name = params.project_name or self.project_name
	if not params.project_name then
		return "project name is null"
	end
	params.visibility = params.visibility or "private"
	local res = util.get_url({
		url = self.api_base_url .. "/projects",
		method = "GET",
		headers = {['PRIVATE-TOKEN'] = self.token},
		data = {
			search=params.project_name,
			owned=true,
		},
	})

	if not res or res.status_code ~= 200 then
		return "获取项目信息失败"
	end
	
	data = res.data or {}

	for _, project in ipairs(data) do
		if string.lower(project.name) == string.lower(params.project_name) then
			return nil, project
		end
	end

	-- 不存创建项目
	res = util.get_url({
		url = self.api_base_url .. "/projects",
		method = "POST",
		headers = {['PRIVATE-TOKEN'] = self.token},
		data = {
			name = params.project_name, 
			request_access_enabled = true, 
			visibility = params.visibility,
		},
	})

	if not res or res.status_code ~= 201 then
		return "创建项目失败"
	end
	
	self.project_id = res.data.id

	self:write_file({path="README.md", content=" "})
	return nil, res.data
end

-- 写文件
function gitlab:write_file(params)
	params.project_id = params.project_id or self.project_id
	if not params.path or not params.content or not params.project_id then
		return "参数错误"
	end

	local method = "PUT"
	local path = util.encode_url(params.path)
	local arg_str = "?ref=" .. (params.ref or "master") 
	local res = util.get_url({
		url = self.api_base_url .. "/projects/" .. tostring(params.project_id) .. "/repository/files/" .. path .. arg_str,
		method = "GET",
		headers = {['PRIVATE-TOKEN'] = self.token},
	});

	if not res or res.status_code ~= 200 then
		--print("获取文件信息失败, 创建文件")
		method = "POST"
	end
	
	res = util.get_url({
		url = self.api_base_url .. "/projects/" .. tostring(params.project_id) .. "/repository/files/" .. path,
		method = method,
		headers = {['PRIVATE-TOKEN'] = self.token},
		data = {
			branch = params.branch or "master",
			encoding = params.encoding or "text",
			content = params.content,
			commit_message = "keepwork commit file: " .. params.path,
		}
	})
	if not res or (res.status_code ~= 200 and res.status_code ~= 201) then
		return "xie文件失败"
	end

	return res.data
end

-- 读文件
function gitlab:get_file(params)
	params.project_id = params.project_id or self.project_id
	if not params.path or not params.project_id then
		return "参数错误"
	end

	local path = util.encode_url(params.path)
	local res = util.get_url({
		url = self.api_base_url .. "/projects/" .. tostring(params.project_id) .. "/repository/files/" .. path .. "?ref=master",
		method = "GET",
		headers = {['PRIVATE-TOKEN'] = self.token},
	});

	if not res or res.status_code ~= 200 then
		return "获取文件内容失败"
	end

	return nil, res.data
end

-- 获取文件内容
function gitlab:get_content(params)
	local err, data = self:get_file(params)

	if not data then
		return err
	end

	return nil, util.decode_base64(data.content)
end


return gitlab







