package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

commonlib = require("commonlib")
util = require("util")
const = require("const")
errors = require("errors")
config = require("config")

log = commonlib.console
errors:set_log(commonlib.console)


--local err = errors:wrap("test")
--commonlib.console(err:is_error())
local err = errors:wrap(nil)
commonlib.console(err:is_error())


err = errors:new("test")
commonlib.console(err:is_error())

