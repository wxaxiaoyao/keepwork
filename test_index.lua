
package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

commonlib = require("commonlib")
http = require("http")
const = require("const")
errors = require("errors")
config = require("config")

errors:set_log(commonlib.console)
