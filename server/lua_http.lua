
local common = require("common")

local util = require("util")
local request = require("request")
local response = require("response")
local router = require("router")
local log = require("log")

local http = {}

http.request = request
http.response = response
http.router = router
http.log = log
http.util = util

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

