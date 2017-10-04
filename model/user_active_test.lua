package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

require("server/commonlib")


local user_active = require("user_active")

user_active:addcount({
	username = "xiaoyao",
	year = 2017,
})

local data = user_active:get_year_data_by_username({
	username = "xiaoyao",
	year = 2017,
})

commonlib.console(data)
