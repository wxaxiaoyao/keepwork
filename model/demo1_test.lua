require("nws/src/test_loader")

local demo_model = nws.import("model/demo")
local test = nws.gettable("nws.test")

local demo1_test = test:new()

function demo1_test:add_test()
	self:assert(demo_model:add(1,2) == 2)
end


demo1_test:start()
--return demo_test


