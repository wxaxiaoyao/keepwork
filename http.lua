
require("helper")

local util = require("util")
local request = require("request")
local response = require("response")
local router = require("router")
local log = require("log")

local http = {}

http.router = router

local req = request:new()
local resp = response:new()

ngx.log(ngx.ERR, req.uri)

function http:init(config)
	config = config or {}

	self.log = log:new(config.log)
end

function http:handle()
	self.router:handle(req, resp)
end

return http

