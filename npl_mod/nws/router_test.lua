require("commonlib")

local router = require("router")


local ctx = {
	request = {
		method = "get"
	}
}

-- 常用路由
router:router("/api/v0/user/login", function(ctx) end) -- 任意方法请求
router:router("/api/v0/user/login", function(ctx) end, 'any') -- 任意方法请求
router:router("/api/v0/user/login", function(ctx) end, 'get')
router:router("/api/v0/user/login", function(ctx) end, 'post')
router:router("/api/v0/user/login", function(ctx) end, 'delete')
router:router("/api/v0/user/login", function(ctx) end, 'put')
router:router("/api/v0/user/login", function(ctx) end, 'head')
router:router("/api/v0/user/login", function(ctx) end, 'patch')
router:router("/api/v0/user/login", function(ctx) end, 'options')

-- 控制器路由
local userController = {}
router:router("/api/v0/user", userController) -- get => userController:get()  post => userController:post() ...
router:router("/api/v0/user/register", userController, "post:register") -- post =>  userController:register()
router:router("/api/v0/user/1", userController, "get") -- get =>  userController:get()
router:router("/api/v0/user/getByName", userController, "getByName") -- get =>  userController:getByName()

router:router("/api/v0/user/login", function(ctx)
	print("------------")
	assert(ctx.request.method == "post", "method error:" .. ctx.request.method)
end, "post")

router:router("/api/:version/user/login", function(ctx)
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


local is_reg, regstr, argslist = router:parse_path("/api/:ver/:user(string)/(int)/login")
print(regstr)
print(string.match("/api/v2/user/3/login", regstr))
