--package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
--package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

--common = require("common")
--util = require("util")
--const = require("const")
--errors = require("errors")
--config = require("config")

--log = common.console
--errors:set_log(common.console)


----local err = errors:wrap("test")
----common.console(err:is_error())
--local err = errors:wrap(nil)
--common.console(err:is_error())


--err = errors:new("test")
--common.console(err:is_error())

local controller = nws.gettable("nws.controller")
local test = controller:new("test")

local test_model = nws.import("model/test")

function test:test(ctx)
	nws.log(ctx.request.headers)
	nws.log("--------------")
end

function test:tabledbCount()
	local data = test_model:count({
		username = "xiaoyao",
	})

	return errors:wrap(nil, data)
end

function test:get()
	log("----------find-------------")
	local data = test_model:find({
		--username = "xiaoyao",
	})

	return errors:wrap(nil, data)
end

function test:tabledbFind()
	log("----------find-------------")
	local data = test_model:find({
		--username = "xiaoyao",
	})

	return errors:wrap(nil, data)
end

function test:tabledbInsert()
	local list = {}
	local data = test_model:insert({
		username = "xiaoyao",
		password = "wuxiangan",
	})

	list[#list+1] = data

	local data = test_model:insert({
		username = "wxatest",
		password = "wuxiangan",
	})

	list[#list+1] = data

	return errors:wrap(nil, list)
end

function test:tabledbUpdate()
	local data = test_model:update({
		username = "xiaoyao",
	}, {
		password = "xiaoyao",
	})

	return errors:wrap(nil, data)
end

function test:tabledbDelete()
	local data = test_model:delete()

	log(data)

	return errors:wrap(nil, data)
end


return test
