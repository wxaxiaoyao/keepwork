package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

require("server/commonlib")

local user = require("api/v0/user")

local request = {}
local response = {}
local params = {}
function response:send(msg)
	commonlib.console(msg)
end


function request:get_params()
	return params
end

params = {
	username="xiaoyao",
	password="wuxiangan",
	channel="keepwork",
}

--commonlib.console(util.toJson(errors:wrap(errors:new("hello world"))))
user:register(request, response)

user:login(request, response)
