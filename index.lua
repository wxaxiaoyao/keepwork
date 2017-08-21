
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua"

--if ngx.var.uri == '/favicon.ico' then
	--return 
--end

require("http_init")



--local share_data = require("share_data")

--ngx.say(share_data.getCount())
--ngx.say(cjson.encode({dog=5}))

local info = debug.getinfo(1)

--log_file:debug("test")
for key, value in pairs(info) do
	ngx.say(key.. ":".. tostring(value))
end


--log:debug("==============")
--log:debug("hello owrld")
ngx.say("hello world")
ngx.say("hello world")


