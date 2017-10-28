-- 将mod放lua搜索路径中
package.path = package.path .. ";/root/workspace/lua/keepwork/npl_mod/?.lua;"

--local nws = NPL.load("nws.nws")
local nws = require("nws.loader")
local config = require("config")
nws:init(config)

local router = nws.router
local log = nws.log

router:path("/hello", function(req, resp)
	resp:send("hello world test")
end)







nws.log.debug("this is debug log, %s, %s", "----------------", "-----------")
nws.log.info("this is info log")
nws.log.info({key="test"})
nws.log.warn("this is warn log")
nws.log.error("this is error log")
nws.log.fatal("this is fatal log")
nws.log.trace("this is trace log")






log("启动服务器...")
-- 启动服务器
nws:start()
