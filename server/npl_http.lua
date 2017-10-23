
NPL.load("(gl)script/ide/commonlib.lua")

local request = import("npl_request")
local response = import("npl_response")
local router = import("router")
--local log = import("log")
local util = import("util")

local http = {
	is_start = false,
}

http.request = request
http.response = response
http.router = router
--http.log = log
http.util = util

function http:init(config)

end


function http:handle(config)
	if self.is_start then
		return 
	end

	local debug_info = debug.getinfo(1, 'S')
	local filename = debug_info.source:match("@?(.*)")
	log(filename)
	--log(filename:match("@?(.*)"))
	--log(debug.getinfo(1,'S').source:match('^[@%./\\]*(.+[/\\])[^/\\]+$'))
	
	local port = config.port or 88
	NPL.AddPublicFile(filename, -10)
	NPL.StartNetServer("0.0.0.0", tostring(port))
end

function activate()
	if not msg then
		return 
	end

	local req = request:new(msg)
	local resp = response:new(req)
	local route = router:new()

	route:handle(req, resp)
end

--NPL.export(http)
NPL.this(activate)

return http
