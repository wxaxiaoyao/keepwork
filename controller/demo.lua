
-- 获取控制器类
local controller = nws.gettable("nws.controller")
--  创建test控制器
local demo = controller:new("demo")

-- 编写test方法
function demo:test(ctx)
	ctx.response:send("hello world")
end

return demo
