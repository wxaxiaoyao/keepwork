-- title: data source
-- author: xiaoyao
-- date: 2017-9-28


package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

require("server/common")

local data_source = require("model/data_source")

data_source:create_inner_gitlab_data_source({username="xiaoyaoaa"})
