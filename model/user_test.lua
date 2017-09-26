
package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

require("server/commonlib")

local user = require("model/user")

user.register({
	username="xiaoyao",
	password="wuxiangan",
})

--test_local()


--local test = {

--}


--setmetatable(test,{
	--key="test",
	--__index = function(t, k)
		--local mt = getmetatable(t)
		----print(t["test"])
		--print(mt["key"])
		--print(k)

		----return nil
	--end
--})

--print(test["abc"])

