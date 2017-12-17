package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

common = require("common")
util = require("util")
const = require("const")
errors = require("errors")
config = require("config")

log = common.console
errors:set_log(common.console)

local user = require("api/v0/user")

local request = {}
local response = {}
local params = {}
function response:send(msg)
	common.console(msg)
end

params = {
	username="xiaoyao",
	password="wuxiangan",
	channel="keepwork",
}

local data = user:register(params, request, response)
common.console(data)

--user:login(request, response)
