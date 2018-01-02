
local controller = nws.gettable("nws.controller")
local page = controller:new("page")

local data_source_model = nws.import("model/data_source")
local file_group_model = nws.import("model/file_group")
local group_user_model = nws.import("model/group_user")

local file_ctrl = nws.import("controller/file")
local user_theme_ctrl = nws.import("controller/user_theme")

function page:page:visit_by_url(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	params.username = username
	if not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local url = params.url
	local path = url .. ".md"
	local access_level = file_ctrl:get_access_level(username, path)
	local dst_username = string.match(path, "[^/]+")
	dst_username = string.match(dst_username, "[^_]*")

	if access_level < const.FILE_ACCESS_READ_LEVEL then
		return (errors:wrap(errors.NOT_PRIVILEGES))
	end

	local theme = user_theme_ctrl:get_best_match_by_path(ctx, {path:path}).data
	local _, data_source = data_source_model:get_default_by_username({username=dst_username})

	if not data_source then
		return (errors:wrap(errors.SERVER_INNER_ERROR))
	end

	local git:init(data_source)
	local content = git:get_content(path=path)

	return (errors:wrap(nil, {content = content, theme=theme, data_source=data_source}))
end
