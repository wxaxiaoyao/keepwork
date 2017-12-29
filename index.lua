nws.import("helper/errors")
nws.import("helper/const")
nws.import("helper/filter")

local user = nws.import("controller/user")
local data_source = nws.import("controller/data_source")
local file_group = nws.import("controller/file_group")
local group = nws.import("controller/group")
local group_user = nws.import("controller/group_user")
local file = nws.import("controller/file")

nws.router(nws.config.api_url_prefix .. "user", user)
nws.router(nws.config.api_url_prefix .. "data_source", data_source)
nws.router(nws.config.api_url_prefix .. "file_group", file_group)
nws.router(nws.config.api_url_prefix .. "group", group)
nws.router(nws.config.api_url_prefix .. "group_user", group_user)
nws.router(nws.config.api_url_prefix .. "file", file)

nws.router.default_handler = function(ctx) 
	--local url = ctx.request.url
	ctx.response:render("index.html", {})
end


