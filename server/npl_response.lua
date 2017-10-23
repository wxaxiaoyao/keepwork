--require('commonlib')
--require('json')
NPL.load('script/ide/commonlib.lua')
NPL.load('script/ide/Json.lua')
--local mimetype = require('mimetype')
local mimetype = require('mimetype')
local template = require("resty.template")

local status_strings = {
    ['200'] ="HTTP/1.1 200 OK\r\n",
    ['201'] ="HTTP/1.1 201 Created\r\n",
    ['202'] ="HTTP/1.1 202 Accepted\r\n",
    ['204'] = "HTTP/1.1 204 No Content\r\n",
    ['300'] = "HTTP/1.1 300 Multiple Choices\r\n",
    ['301'] = "HTTP/1.1 301 Moved Permanently\r\n",
    ['302'] = "HTTP/1.1 302 Moved Temporarily\r\n",
    ['304'] = "HTTP/1.1 304 Not Modified\r\n",
    ['400'] = "HTTP/1.1 400 Bad Request\r\n",
    ['404'] = "HTTP/1.1 401 Unauthorized\r\n",
    ['403'] = "HTTP/1.1 403 Forbidden\r\n",
    ['404'] = "HTTP/1.1 404 Not Found\r\n",
    ['500'] = "HTTP/1.1 500 Internal Server Error\r\n",
    ['501'] = "HTTP/1.1 501 Not Implemented\r\n",
    ['502'] = "HTTP/1.1 502 Bad Gateway\r\n",
    ['503'] = "HTTP/1.1 503 Service Unavailable\r\n",
}


local response = {}


function response:new(req)
	local obj = {}
	setmetatable(obj, self)
	obj.__index = self
	obj.request = req
	obj.charset = 'utf-8'
	obj.status = '200'
	obj.content_type = mimetype.html
	obj.headers = {
		--['status'] = '200',
		['Content-Type'] = mimetype.html
	}
	return o
end


function response:set_status(status)
	self.status = tostring(status)
end


function response:set_content_type(mime_type)
	self.content_type = mime_type
	self:set_header('Content-Type', mime_type .. 'charset=' .. self.charset)
end


function response:set_charset(charset)
	self.charset = charset
	self:set_header('Content-Type', self.contentType .. 'charset=' .. self.charset)
end


function response:set_content(data)
	self.data = data
	self:set_header('Content-Length', #data)
end


function response:set_header(key, val)
	self.headers[key] = val
end


function response:onBefore()

end


function response:onAfter()

end


function response:append_cookie(cookie)
	if(not self.cookies) then
		self.cookies = {}
	end
	self.cookies[#(self.cookies) + 1] = cookie
end



function response:_send()
	local out = {}
    out[#out+1] = status_strings[self.status]

    for name, value in pairs(self.headers) do
        out[#out+1] = format("%s: %s\r\n", name, value)
    end

	--if(self.cookies) then
		--local i = 1
		--for i = 1, #(self.cookies) do
			--local cookie = self.cookies[i]
			--out[#out + 1] = cookie:toString()
		--end
	--end

    out[#out+1] = "\r\n"
    out[#out+1] = self.data

    NPL.activate(format("%s:http", self.request.nid), table.concat(out))
end


-- ∑µªÿ ”Õº
function response:render(view, context)
	template.render(view, context)
end

function response:send(data)
	if(not data) then
		data = self.data
	end
	
	data = data or ""

	if(type(data) == 'table') then
		self:set_content_type(mimetype.json)
		data = commonlib.Json.Encode(data)
	else
		data = tostring(data)
	end

	self:set_content(data)

	self:_send()
end


function response:render(templateUrl, data)
end


function response:redirect(url)
	self:set_status(302)
	self:set_header('Location', url)
	self:send()
end

return response
