package.path = package.path .. ";/root/workspace/lua/keepwork/npl_mod/?.lua;"
NPL.load("(gl)script/ide/commonlib.lua")

--local nws = NPL.load("nws.nws")
local nws = require("nws.nws")
new:init()


nws:start()


NPL.this(function() end)
