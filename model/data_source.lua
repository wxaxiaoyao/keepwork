-- title: data source
-- author: xiaoyao
-- date: 2017-9-28


local orm = require("orm/orm")

-- user 表
local data_source = commonlib.inherit(orm)
data_source:tablename("data_source")


-- table field
--  data_source_id number
--  username string
--  data_source_name string
--  type string
--  token string
--  api_base_url string
--  raw_base_url string
--  external_user_id number
--  external_username string
--  external_password string
--  create_time
--  update_time


local l_admin_token = config["default"]["account_info"]["gitlab"]["token"]
local l_gitlab_host = "http://" .. config["default"]["account_info"]["gitlab"]["host"]

-- 创建gitlab用户
function data_source:create_inner_gitlab_data_source(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	-- 已存在直接返回
	local data = self:get_by_username(params).data
	if data and #data ~= 0 then
		return errors:wrap(nil, data)
	end

	local gitlab_user_params = {}
	gitlab_user_params.username = params.username
	gitlab_user_params.name = gitlab_user_params.username
	gitlab_user_params.email = gitlab_user_params.name .. '@paraengine.com'
	-- 使用keepwork账号密码
	gitlab_user_params.password = params.password or tostring(os.time())
	gitlab_user_params.skip_confirmation = true

	local api_base_url = l_gitlab_host .. "/api/v4"
	local raw_base_url = l_gitlab_host 

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

	-- 拉取用户信息
	local res = util.request_url({
		url = api_base_url .. "/users",
		method = "GET",
		headers = {['PRIVATE-TOKEN']= l_admin_token},
		params = {username=params.username},
	})

	if not res or res.status_code ~= 200 then
		return errors:wrap(errors:new("get gitlab user info error:".. tostring(res.status_code)))
	end

	data = res.data or {}

	if #data == 0 then
		-- 不存在创建用户
		res = util.request_url({
			url = api_base_url .. "/users",
			method = "POST",
			headers = {['PRIVATE-TOKEN']= l_admin_token},
			data = gitlab_user_params,
		})
		commonlib.console(res)
		if not res or res.status_code ~= 201 then
			return errors:wrap(errors:new("create gitlab user error"), res)
		end
		gitlab_user.external_user_id = res.data.id
	else
		-- 存在获取用户id
		gitlab_user.external_user_id = data[1].id
	end

	-- 检测token
	res = util.request_url({
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
		res = util.request_url({
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

	local ok, msg = self:insert(gitlab_user)
	if ok == nil then
		return errors:wrap(errors:new(msg))
	end

	return errors:wrap(nil)
end


-- 获取记录
function data_source:get_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find({username=params.username})

	return errors:wrap(nil, data)
end

-- 获取默认数据源
function data_source:get_default_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({username=params.username, is_default = 1})

	return errors:wrap(nil, data)
end

-- 获取用户指定的数据源
function data_source:get_by_name(params)
	if not params.username or not params.data_source_name then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one(username=params.username, data_source_name=params.data_source_name)

	return errors:wrap(nil, data)
end

return data_source
