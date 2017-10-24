
local HTTP_SERVER_TYPE_LUA = "lua"
local HTTP_SERVER_TYPE_NPL = "npl"


function npl_init()
	NPL.load("(gl)script/ide/commonlib.lua")
end

function lua_init()

end

if HTTP_SERVER_TYPE == HTTP_SERVER_TYPE_LUA then
	lua_init()
else
	npl_init()
end

function import(filename)
	if HTTP_SERVER_TYPE == HTTP_SERVER_TYPE_LUA then
		return require(filename)
	else
		return require(filename)
		--return NPL.load(filename)
	end
end

--log(debug.getinfo(1))

local http = import(HTTP_SERVER_TYPE .. "_http")
--local http = NPL.load("npl_http.lua")
--local http = require("npl_http")

return http


