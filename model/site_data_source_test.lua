-- title: data source
-- author: xiaoyao
-- date: 2017-9-28


package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

commonlib = require("commonlib")
util = require("util")
const = require("const")
errors = require("errors")
config = require("config")

log = commonlib.console
errors:set_log(commonlib.console)

local site_data_source = require("model/site_data_source")

local data = site_data_source:get_default_site_data_source({username="xiaoyao"})
