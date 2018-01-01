local cjson = require("cjson")
local cjson_safe = require("cjson.safe")
local luajwt = require("luajwt")
local requests = require("requests")

local function get_url(params)
	local method = params.method or "GET"

	if params.headers then
		params.headers['Content-Type'] = params.headers['Content-Type'] or "application/json"
	else
		params.headers = {['Content-Type'] = "application/json"}
	end

	if string.lower(method) == "get" then
		params.params = params.data
	end
	local res = requests.request(method, params)

	res.data = res.json()

	return res
end

local method = ngx.req.get_method()

local headers = ngx.req.get_headers();
--for k, v in pairs(headers) do
	--ngx.log(ngx.ERR, k .. ":" .. v)
--end

if method == "OPTIONS" then
	ngx.header["Access-Control-Allow-Origin"] = "*"
	ngx.header["Access-Control-Allow-Methods"] = "GET PUT POST DELETE"
	ngx.header["Access-Control-Allow-Headers"] = headers["access-control-request-headers"]
	--ngx.req.set_header("Access-Control-Allow-Headers", "private-token")
	ngx.exit(200)
	return
end

ngx.var.dst_uri = "https://gitlab.com" .. ngx.var.request_uri
	
