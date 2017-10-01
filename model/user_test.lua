
package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

require("server/commonlib")

local user = require("model/user")

--user:register({
	--username="xiaoyao1",
	--password="wuxiangan",
--})


local data = user:get_by_username({username="xiaoyao"})
commonlib.console(data)

--commonlib.console(errors:wrap("hello world"))
--commonlib.console(3,"test", "test")




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

