-- 将mod放lua搜索路径中
package.path = package.path .. ";/root/workspace/lua/keepwork/npl_mod/?.lua;"

--local nws = NPL.load("nws.nws")
local nws = require("nws.loader")
local config = require("config")
nws:init(config)

log(nws)

local router = nws.router

log(router)
router:path("/test", function(req, resp)
	log("----------------")
	resp:send("hello world")
end)














log("启动服务器...")
-- 启动服务器
nws:start()
