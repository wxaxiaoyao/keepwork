package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

commonlib = require("commonlib")
util = require("util")
const = require("const")
errors = require("errors")
config = require("config")

log = commonlib.console
errors:set_log(commonlib.console)

local user = require("api/v0/user")

local request = {}
local response = {}
local params = {}
function response:send(msg)
	commonlib.console(msg)
end

params = {
	username="xiaoyao",
	password="wuxiangan",
	channel="keepwork",
}

local data = user:register(params, request, response)
commonlib.console(data)

--user:login(request, response)
