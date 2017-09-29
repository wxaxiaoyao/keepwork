
require("commonlib")

local util = require("util")
local request = require("request")
local response = require("response")
local router = require("router")
local log = require("log")

local http = {}

http.router = router

local req = request:new()
local resp = response:new()
local _router = router:new()

ngx_log(req.uri)

function http:init(config)
	config = config or {}
	--self.log = log:new(config.log)
end

function http:handle()
	_router:handle(req, resp)
end

return http

