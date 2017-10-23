
package.path = package.path .. ";/root/workspace/lua/keepwork/server/?.lua;?.lua"
package.path = package.path .. ";/root/workspace/lua/keepwork/?.lua;?.lua"

--NPL.load("(gl)script/ide/commonlib.lua")

-- 定义服务器类型
HTTP_SERVER_TYPE = "npl"

common = require("common")
http = require("http")
const = require("const")
errors = require("errors")
config = require("config")

util = http.util
-- 初始化http

--errors:set_log(commonlib.console)
errors:set_log(ngx_log)
--log = ngx_log

local router = http.router


function get_bust_version()
	return os.time()
end

function render_server_wWiki_css() 
	local bust_version = get_bust_version()

	return string.format('<link href="/wiki/assets/css/main.css?bust=%s" rel="stylesheet">\n', bust_version)
end

function render_server_wiki_script() 
	local bust_version = get_bust_version()
	local script_str = ""
	script_str = script_str .. string.format('<script src="/wiki/js/app/config.js?bust=%s"></script>\n', bust_version)
	script_str = script_str .. string.format('<script data-main="/wiki/js/main.js?bust=%s" src="/wiki/js/lib/requirejs/require.js?bust=%s"></script>\n', bust_version, bust_version)

	return script_str
end

router:setDefaultHandle(function(req, resp)
	resp:render("index.html", {
		render_server_wWiki_css=render_server_wWiki_css,
		render_server_wiki_script=render_server_wiki_script,
	})	
end)

router:path("/test", function(req, resp)
	resp:send("hello world")
end)

router:filemap('/api/wiki/models', '/root/workspace/lua/keepwork/api/v0', true)

http:handle(config)

--function activate()
	----print("-----------")
--end

--NPL.this(activate)
