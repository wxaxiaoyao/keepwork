require("commonlib")

local router = require("router")


local ctx = {
	request = {
		method = "get"
	}
}


router:router("/api/v0/user/login", function(ctx)
	print("------------")
	assert(ctx.request.method == "post", "method error:" .. ctx.request.method)
end, "post")

--router:router("/api/v0/user/login", function(ctx)
	--assert(ctx.request.method == "get", "method error")
--end, "get")

commonlib.console(router)

ctx.request.method = "get"
router:handle("/api/v0/user/login", ctx)
ctx.request.method = "post"
router:handle("/api/v0/user/login", ctx)

