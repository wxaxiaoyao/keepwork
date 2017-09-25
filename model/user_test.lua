
package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

require("server/helper")

local user_class= require("model/user")

local user = user_class:new()
user:test()
