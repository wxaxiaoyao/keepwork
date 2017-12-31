
local controller = nws.gettable("nws.controller")
local file = controller:new("file")

local file_model = nws.import("model/file")
local data_source_model = nws.import("model/data_source")
local file_group_model = nws.import("model/file_group")
local group_user_model = nws.import("model/group_user")

local function get_content(path) 
	local username = string.match(path, '([^/]+)')
	local username = string.match(username,'([^_]+)')
	local err, git = data_source_model:get_default_git_by_username({username=username})
	if not git then
		return (errors:wrap(err))
	end

	return git:get_content({path=path})
end

local function get_access_level(username, path) 
	local dst_username = string.match(path, "[^/]+")

	if not dst_username or dst_username == "" then
		return const.FILE_ACCESS_FORBIT_LEVEL
	end

	if username and username == dst_username then
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

function file:_get_content_by_path(username, path)
	local access_level = get_access_level(username, path)

	if access_level < const.FILE_ACCESS_READ_LEVEL then
		return (errors:wrap("权限不足"))
	end

	local err, content = get_content(path)

	return err, content
end

function file:get_content_by_path(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	if not params.path then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	local err, content = self:_get_content_by_path(username, params.path)
	return (errors:wrap(err, content))
end

return file
