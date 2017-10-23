package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

common = require("common")
util = require("util")
const = require("const")
errors = require("errors")
config = require("config")

log = common.console
errors:set_log(common.console)


--local err = errors:wrap("test")
--common.console(err:is_error())
local err = errors:wrap(nil)
common.console(err:is_error())


err = errors:new("test")
common.console(err:is_error())

