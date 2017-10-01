local template = require("resty.template")
local cjson = require("cjson")
local cjson_safe = require("cjson.safe")

local mimetype = require("mimetype")
local util = require("util")

local response = {}

function response:new()
	local obj = {}

	setmetatable(obj, self)
	self.__index = self

	-- 默认返回内容
	ngx.header["Content-Type"] = mimetype.html

	return obj
end

-- 返回视图
function response:render(view, context)
	template.render(view, context)
end

-- 发送json
function response:sendJson(data)
	ngx.header["Content-Type"] = mimetype.json
	ngx.say(cjson_safe.encode(data))
end

-- 发送文本
function response:send(data)
	if type(data) == "table" then
		self:sendJson(data)
	else
		ngx.say(tostring(data))
	end
end

return response
