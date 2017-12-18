nws.import("helper/errors")
nws.import("helper/const")
nws.import("helper/filter")

local user = nws.import("controller/user")
local data_source = nws.import("controller/data_source")

nws.router(nws.config.api_url_prefix .. "user", user)
nws.router(nws.config.api_url_prefix .. "data_source", data_source)

nws.router.default_handler = function(ctx) 
	ctx.response:render("index.html", {});
end


