nws.import("helper/errors")
nws.import("helper/const")
nws.import("helper/filter")

local user = nws.import("controller/user")

nws.router(nws.config.api_url_prefix .. "user", user)

nws.router.default_handler = function(ctx) 
	ctx.response:render("index.html", {});
end


