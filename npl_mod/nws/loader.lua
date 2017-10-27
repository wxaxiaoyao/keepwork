


--local nws = commonlib.gettable("nws")
local nws = {
	is_start = false,
}

commonlib = commonlib or nil
local mod_prefix = "nws"
local server_type = "npl"
local server_type_lua = "lua"
local server_type_npl = "npl"

local default_config = {
	server_type = "npl",
}

function nws.import(modname)
	modname = mod_prefix .. "." .. modname
	if server_type == server_type_lua then
		return require(modname)
	else
		--return require(modname)
		return NPL.load(modname)
	end
end

function nws:init(config)
	config = config or default_config 

	-- 服务器类型 npl lua
	server_type = config.server_type or "npl"

	if server_type == "npl" then
		NPL.load("(gl)script/ide/commonlib.lua")
		NPL.this(function() end)
	else
		commonlib = require("nws.commonlib")
	end

	self.config = config
	self.orm = self.import("orm.orm")
	self.router = self.import("router")
	self.mimetype = self.import("mimetype")
	self.request = self.import(server_type .. "_request")
	self.response = self.import(server_type .. "_response")
	self.http = self.import(server_type .. "_http")
	self.util = self.import(server_type .. "_util")
end

function nws:start()
	if self.is_start then
		print("服务器已启动...")
		return 
	end


	self.http:handle(self.config)
end

return nws

