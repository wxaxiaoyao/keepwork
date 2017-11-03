
local controller = commonlib.gettable("nws.controller")

local test = controller:new("test")

function test:test(ctx)
	ctx.response:send("hello world")
end

return test
