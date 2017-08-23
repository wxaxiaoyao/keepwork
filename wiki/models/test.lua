

local test = {}

function test:test()
	ngx.say("hello ------ test")
end

function test:api_test(req, resp)
	self:test()
	if not resp then
		ngx.say("hello ------ test")
	end

	resp:send("hello test")
end


return test
