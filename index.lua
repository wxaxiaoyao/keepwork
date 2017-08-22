
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua"

local http = require("http")
--if ngx.var.uri == '/favicon.ico' then
	--return 
--end

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

