
local controller = nws.gettable("nws.controller")
local page = controller:new("page")

local gitlab = nws.import("helper/gitlab")
local page_model = nws.import("model/page")
local data_source_model = nws.import("model/data_source")
local file_group_model = nws.import("model/file_group")
local group_user_model = nws.import("model/group_user")
local user_visit_history_model = nws.import("model/user_visit_history")

local file_ctrl = nws.import("controller/file")
local user_theme_ctrl = nws.import("controller/user_theme")

function page:visit_by_url(ctx)
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

	local theme = user_theme_ctrl:get_best_match_by_path(ctx, {path = path}).data
	local _, data_source = data_source_model:get_default_by_username({username=dst_username})

	if not data_source then
		return (errors:wrap(errors.SERVER_INNER_ERROR))
	end

	local git = gitlab:init(data_source)
	--local content = git:get_content({path=path})

	-- 访问计数 TODO 应该做ip限制 防止刷访问量
	local url_page = page_model:get_by_url({url = url})
	if url_page then
		url_page.count = (url_page.count or 0) + 1
		page_model:set_page(url_page)
	end

	-- 添加访问历史
	if username then
		user_visit_history_model:set({username = username, url = url})
	end

	return (errors:wrap(nil, {content = content, page=url_page, theme=theme, data_source=data_source}))
end

-- 获取最近更新页
function page:get_renew_by_username(ctx)
	local params = ctx.request:get_params()

	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = page_model:get_renew(params)

	return (errors:wrap(err, data))
end

function page:set_page(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	if not username or not params.username or not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	if username ~= params.username then
		nws.log("做权限认证")
		return (errors:wrap("TODO: 权限认证"))
	end
	
	local visit_count = params.visit_count
	params.visit_count = nil
	params.content = nil
	page_model:set_page(params)

	return (errors:wrap(nil))
end

function page:delete_by_url(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	if not username or not params.username or not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end
	
	if username ~= params.username then
		nws.log("做权限认证")
		return (errors:wrap("TODO: 权限认证"))
	end

	local err = page_model:delete_by_url(params)

	return (errors:wrap(err))
end

return page
