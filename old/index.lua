-- 将mod放lua搜索路径中
package.path = package.path .. ";/root/workspace/lua/keepwork/npl_mod/?.lua;"

--NPL.load("(gl)script/ide/commonlib.lua")
--local nws = NPL.load("nws.nws")
local nws = require("nws.loader")
local config = require("config")
--log(config)
nws.init(config)

local router = nws.router
local log = nws.log

--local file = io.open("controllers/test.lua", "rb")
--if not file then
	--log("-------------")
--else 
	--local content = file:read("*a")
	--log(content)
--end
--file:close()

--log("-------------1")



--nws.log.debug("this is debug log, %s, %s", "----------------", "-----------")
--nws.log.info("this is info log")
--nws.log.info({key="test"})
--nws.log.warn("this is warn log")
--nws.log.error("this is error log")
--nws.log.fatal("this is fatal log")
--nws.log.trace("this is trace log")






log("启动服务器...")
-- 启动服务器
nws.start()
