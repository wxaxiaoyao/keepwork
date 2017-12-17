--require("nws/src/test_loader")

local demo_model = nws.import("model/demo")
local test = nws.gettable("nws.test")

local demo_test = test:new()

function demo_test:add_test()
	self:assert(demo_model:add(1,2) == 2)
end


demo_test:start()
--return demo_test


