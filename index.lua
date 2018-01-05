nws.import("helper/errors")
nws.import("helper/const")
nws.import("helper/filter")

local test = nws.import("controller/test")
local user = nws.import("controller/user")
local data_source = nws.import("controller/data_source")
local file_group = nws.import("controller/file_group")
local group = nws.import("controller/group")
local group_user = nws.import("controller/group_user")
local file = nws.import("controller/file")
local page = nws.import("controller/page")
local visit_history = nws.import("controller/visit_history")
local fans = nws.import("controller/fans")
local favorite = nws.import("controller/favorite")

nws.router(nws.config.api_url_prefix .. "test", test)
nws.router(nws.config.api_url_prefix .. "user", user)
nws.router(nws.config.api_url_prefix .. "data_source", data_source)
nws.router(nws.config.api_url_prefix .. "file_group", file_group)
nws.router(nws.config.api_url_prefix .. "group", group)
nws.router(nws.config.api_url_prefix .. "group_user", group_user)
nws.router(nws.config.api_url_prefix .. "file", file)
nws.router(nws.config.api_url_prefix .. "page", page)
nws.router(nws.config.api_url_prefix .. "visit_history", visit_history)
nws.router(nws.config.api_url_prefix .. "fans", fans)
nws.router(nws.config.api_url_prefix .. "favorite", favorite)

nws.router.default_handler = function(ctx) 
	local url = ctx.request.url
	local path = string.match(url, "([^?]+)")
	local ext = path:match('^.+%.([a-zA-Z0-9]+)$')
	local dst_username = string.match(url, "/([^/]+)")
	if not dst_username or dst_username == "www" or url == ("/" .. dst_username) then
		ctx.response:render("www/index.html", {})
		return
	end

	-- git 静态资源
	--if (string.find(dst_username, "_")) then
		--local err, content = file:_get_content_by_path(ctx.username, path)
		--ctx.response:set_content_type_by_ext(ext)
		--ctx.response:send(content)
		--return
	--end

	--local err, content = file:_get_content_by_path(ctx.username, path .. ".md")
	-- 用户页面
	ctx.response:render("www/index.html", {content = content})
	return
end


