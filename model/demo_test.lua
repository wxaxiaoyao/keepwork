
local demo_model = nws.import("model/demo")
local demo_test = nws.gettable("nws.model.demo_test")


function demo_test:add_test()
	nws.assert(demo_model.add(1,2) == 3)
end



