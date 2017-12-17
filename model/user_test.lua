
package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

common = require("common")
util = require("util")
const = require("const")
errors = require("errors")
config = require("config")

local user = require("model/user")

--user:register({
	--username="xiaoyao1",
	--password="wuxiangan",
--})


local data = user:get_by_username({username="xiaoyao"})
common.console(data)

common.console(user:test())
--common.console(errors:wrap("hello world"))
--common.console(3,"test", "test")




--local test = setmetatable({},{
	--key="test",
	--_key="_key",
	--__index = function(t, k)
		--local mt = getmetatable(t)
		--local pos = string.find(k, '_')
		--if pos == 1 then
			--return nil
		--end
		--return mt[k]
	--end
--})

--print(test["abc"])
--print(test.key)
--print(test._key)

