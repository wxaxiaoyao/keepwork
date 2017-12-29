
local controller = nws.gettable("nws.controller")
local file = controller:new("file")

local file_model = nws.import("model/file")
local data_source_model = nws.import("model/data_source")
local file_group_model = nws.import("model/file_group")

local function get_content(username, path) 
	local username = string.match(path, '([^/]+)')
	local err, git = data_source_model:get_default_git_by_username({username=username})
	if not git then
		return (errors:wrap(err))
	end

	return git:get_content({path=path})
end

function file:get_content_by_path(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	if not params.path then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end
	local path = params.path
	local dst_username = string.match(path, "[^/]+")

	if username and username == dst_username then
		return (errors:wrap(get_content(params.path)))
	end

	local file_group_list = file_group_model:get_by_username({username = dst_username})
	local group_path_len = 0, group_list = {}
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
		return (errors:wrap(get_content(dst_username, path)))
	elseif not username then
		return (errors:wrap(errors.NOT_PRIVILEGES))
	end

	for _, x in ipairs(group_list or {}) do

	end

	return errors:wrap(nil)
end

return file
