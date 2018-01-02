
local controller = nws.gettable("nws.controller")
local file_group = controller:new("file_group")

local data_source_model = nws.import("model/data_source")
local file_group_model = nws.import("model/file_group")
local group_user_model = nws.import("model/group_user")

-- 设置文件组
function file_group:set_file_group(ctx)
	local params = ctx.request:get_params()
	local username = ctx.username

	params.username = username

	local err = file_group_model:set_file_group(params)

	return (errors:wrap(err))
end

-- 获取用户文件组
function file_group:get_by_username(ctx)
	local username = ctx.username

	local err, data = file_group_model:get_by_username({username=username})

	return (errors:wrap(err, data))
end

-- 通过id删除
function file_group:delete_by_id(ctx)
	local params = ctx.request:get_params()
	local username = ctx.username

	if not username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = file_group_model:get_by_id(params)
	if not data or data.username ~= username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = file_group_model:delete_by_id(params)

	return (errors:wrap(err))
end

local function get_access_level(username, path) 
	local dst_username = string.match(path, "[^/]+")

	if not dst_username or dst_username == "" then
		return const.FILE_ACCESS_FORBIT_LEVEL
	end

	if username and username == dst_username then
		return const.FILE_ACCESS_WRITE_LEVEL
	end

	-- 图片 文件资源暂不做权限
	if (string.find(dst_username, "_")) then
		return const.FILE_ACCESS_WRITE_LEVEL
	end

	local file_group_list = file_group_model:get_by_username({username = dst_username})
	local group_path_len = 0
	local group_list = {}
	local access_level = const.FILE_ACCESS_FORBIT_LEVEL
	-- 获取最匹配的文件组设置
	for _, x in ipairs(file_group_list or {}) do
		if (string.find(path, x.path)) == 1 then
			if group_path_len < #x.path then
				group_list = {x}
				group_path_len = #x.path
			elseif group_path_len == #x.path then
				group_list[#group_list+1] = x
			end
		end
	end

	if #group_list == 0 then
		-- 没有配置 默认可读级别
		return const.FILE_ACCESS_READ_LEVEL
	elseif not username then
		return const.FILE_ACCESS_FORBIT_LEVEL	
	end

	for _, x in ipairs(group_list or {}) do
		local data = group_user_model:find({
			username = x.group_username,
			groupname = x.groupname,
			membername = dst_username,
		})	
		for _, y in ipairs(data or {}) do
			if y.level > access_level then
				access_level = y.level
			end
		end
	end

	return access_level
end

-- 通过获取用户访问权限
function file_group:is_accessible_by_path(ctx)
	-- TODO IP限制
	local username = ctx.username
	local params = ctx.request:get_params()
	
	-- 应该改ip限制  或隐藏token
	--if not params.token or params.token ~= "keepwork" then
		--return (errors:wrap(errors.PARAMS_ERROR))
	--end
	local client_ip = ctx.request:get_peername()
	if client_ip ~= "127.0.0.1" and client_ip ~= "39.106.11.114" then 
		return (errors:wrap("没有权限"))
	end

	if not params.path or not params.method then
		return (errors:wrap(errors.PARAMS_ERROR))
	end
	
	local min_access_level = const.FILE_ACCESS_READ_LEVEL
	local access_level = get_access_level(username, params.path)
	
	if string.upper(params.method) ~= "GET" then
		min_access_level = const.FILE_ACCESS_WRITE_LEVEL
	end
	
	if access_level < min_access_level then
		return (errors:wrap("权限不足"))
	end

	local dst_username = string.match(params.path, "[^/]+")
	dst_username = string.match(dst_username, "([^_]+)")
	local err, git = data_source_model:get_default_by_username({username=dst_username})
	if not git then
		return (errors:wrap(errors.NOT_FOUND))
	end
	
	return (errors:wrap(nil, git))
end

return file_group
