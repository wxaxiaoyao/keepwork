
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

local http = require("http")
local config = require("config")
local user = require("user")
-- 初始化http
http:init(config)

local log = http.log
local router = http.router


router:path("/", function(req, resp)
	local _user = user:new()
	local ret = _user:find({username="wuxiangan", password="wuxiangan"})
	resp:send(ret)
end)

router:filemap('/api/wiki/models', '/root/workspace/lua/keepwork/wiki/models')

http:handle()

--require("http_init")


--local share_data = require("share_data")

--ngx.say(share_data.getCount())
--ngx.say(cjson.encode({dog=5}))



--log:debug("==============")
--log:debug("hello owrld")
--ngx.say("hello world")


--function RenderServerWikiCss() 
--end

--function RenderServerWikiScript() 
	--return "<div>helloworl</div>"
--end

--ngx.header["Content-Type"] = "text/html"
--template.render("wiki/index.page", {
	--RenderServerWikiCss=RenderServerWikiCss(),
	--RenderServerWikiScript=RenderServerWikiScript(),
--})

