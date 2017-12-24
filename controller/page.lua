
local controller = nws.gettable("nws.controller")
local page = controller:new("page")

local user_file_model = nws.import("model/user_file")
local data_source_model = nws.import("model/data_source")

local function get_content_by_path(path) 
	local username = string.match(path, '([^/]+)')
	local err, git = data_source_model:get_default_git_by_username({username=username})
	if not git then
		return (errors:wrap(err))
	end

	return git:get_content({path=path})
end

function page:get_content_by_path(ctx)
	nws.log("00000000000000");
	local username = ctx.username
	local params = ctx.request:get_params()

	nws.log(params)
	nws.log(username)
	if not params.path then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	if (string.find(params.path, username)) == 1 then
		return (errors:wrap(get_content_by_path(params.path)))
	end

	return errors:wrap(nil)
end

return page
