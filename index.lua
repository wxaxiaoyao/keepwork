
package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

local http = require("http")
local config = require("config")
local user = require("user")
local util = require("util")
-- 初始化http
http:init(config)

local log = http.log
local router = http.router

function getBustVersion()
	return os.time()
end

function RenderServerWikiCss() 
	local bustVersion = getBustVersion()

	return string.format('<link href="/wiki/assets/css/main.css?bust=%s" rel="stylesheet">\n', bustVersion)
end

function RenderServerWikiScript() 
end
router:setDefaultHandle(function(req, resp)
	--ngx.log(ngx.INFO, "--------------")
	--ngx.log(ngx.ERR, "--------------")
	resp:render("index.html", {
		RenderServerWikiCss=RenderServerWikiCss,
		RenderServerWikiScript=function()
		end
	})	
end)

--router:path("/", function(req, resp)
	--local _user = user:new()
	--local ret = _user:find({username="wuxiangan", password="wuxiangan"})
	----ngx.say(ret)
	--ret = _user:update({username="wuxiangan"}, {password="xiaoyao"})
	----ngx.say(ret)
	--ret = _user:insert({
		--username="xiaoyao5",
		--password="wuxiangan",
		--desc="this is test",
	--})
	--util.say(ret)
	----resp:send(ret)
--end)

router:path("/find", function(req, resp)
	local _user = user:new()
	local ret = _user:find({password="wuxiangan"})
	util.say(ret)
	--resp:send(ret)
end)

router:path("/update", function(req, resp)
	local _user = user:new()
	local ret = _user:update({username="xiaoyao"}, {desc="test update"})
	util.say(ret)
	--resp:send(ret)
end)

router:path("/delete", function(req, resp)
	local _user = user:new()
	local ret = _user:delete({username="xiaoyao1"})
	util.say(ret)
	--resp:send(ret)
end)

router:path("/insert", function(req, resp)
	local _user = user:new()
	local ret = _user:insert({username="xiaoyao1", password="wuxiangan"})
	util.say(ret)
	--resp:send(ret)
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



--ngx.header["Content-Type"] = "text/html"
--template.render("wiki/index.page", {
	--RenderServerWikiCss=RenderServerWikiCss(),
	--RenderServerWikiScript=RenderServerWikiScript(),
--})

