
local orm = require("orm/orm")
local router = require("router")

local HTTP_SERVER_TYPE_LUA = "lua"
local HTTP_SERVER_TYPE_NPL = "npl"

local server_type = "npl"

function npl_init()
	NPL.load("(gl)script/ide/commonlib.lua")
end

function lua_init()

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

local http = {
	is_start = false,
	router = router,
}

local function init_env(config)
	if server_type == "npl" then
		npl_init()
	else
		lua_init()
	end

	http.util = require(server_type .. "_util")
end


local function init_db(config)
	orm:init(config.database)
end

function http:init(config)
	self.config = config

	server_type = config.server_type or "npl"

	-- 环境初始化
	init_env()

	-- 数据库初始化
	init_db(config)

	-- 启动webserver
	self.http = require(server_type .. "_http")
end

function http:start(config)
	if self.is_start then
		return
	end

	-- 请求处理
	self.http:handle(self.config)

	-- 标记已启动
	self.is_start = true
end

return http


