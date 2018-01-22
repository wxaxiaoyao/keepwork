local cjson = require("cjson")
local cjson_safe = require("cjson.safe")
local luajwt = require("luajwt")
local requests = require("requests")

local config = require("config")

local dns_map = {
	["gitlab.com"] = "52.167.219.168",
}

local token_map = config.data_source_token

-- jwt 编码
local function encode_jwt(payload, secret, expire)
	local alg = "HS256"
	payload = payload or {}
	secret = secret or "keepwork"
	payload.iss = "xiaoyao"
	payload.nbf = os.time()
	payload.exp = os.time() + (expire or 3600)

	local token, err = luajwt.encode(payload, secret, alg)

	return token
end

-- jwt 编码
local function decode_jwt(token, secret)
	if not token then
		return nil
	end

	secret = secret or "keepwork"
	local payload, err = luajwt.decode(token, secret)
	
	return payload
end

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

local function log(t) 
	local info = debug.getinfo(2)
	local filepos = info.source .. ":" .. info.currentline
	ngx.log(ngx.ERR, "位置:" .. filepos)

	if type(t) ~= "table" then
		ngx.log(ngx.ERR, tostring(t))
		return
	end

	for key, value in pairs(t or {}) do
		ngx.log(ngx.ERR, key .. ":" .. tostring(value))
	end
end

local method = ngx.req.get_method()
local args = ngx.req.get_uri_args() or {}
local headers = ngx.req.get_headers();

local proxyurlprefix = headers["proxyurlprefix"] or  args.proxyurlprefix or ""
local proxytoken = headers["proxytoken"] or args.proxytoken or ""
local proxygittype= headers["proxygittype"] or "gitlab"
local private_token = headers["private-token"]
--local auth_username = luajwt.
--ngx.var.dst_uri = proxyurlprefix .. ngx.var.request_uri

if method == "OPTIONS" then
	ngx.header["Access-Control-Allow-Origin"] = "*"
	ngx.header["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE"
	ngx.header["Access-Control-Allow-Headers"] = headers["access-control-request-headers"]
	ngx.exit(200)
	return;
end

local path = ngx.var.uri
local file_path = nil

--log(ngx.var.args)

if proxygittype == "gitlab" then
	-- tree 路径
	file_path = args.path

	log(file_path)

	-- 部分接口直接放行
	if string.match(path, '/repository/tree$') then
		--return 
	end

	-- 文件curd路径
	if not file_path then
		file_path = string.match(path, '/repository/files/([^?]+)')
	end

	-- raw file
	if not file_path then
		file_path = string.match(path, "/raw/[%w%d]+/([^?]+)")
	end
end

if not file_path then
	ngx.log(ngx.ERR, "参数解析错误")
	ngx.exit(404)
	return
end

local dst_username = string.match(file_path, "([^/]+)")
-- 图片 文件资源暂不做权限
if (string.find(dst_username, "_")) then
	--return
end

local res = get_url({
	url="http://127.0.0.1:8888/api/v1/file_group/is_accessible_by_path",
	headers = {
		["authorization"] = "bearer " .. proxytoken,
	},
	data = {
		token = "keepwork",
		method = method,
		path = file_path,
	},
})

--log(res.status_code)
--log(res.data)

if res.status_code ~= 200 or not res.data or not res.data.data or not res.data.data.token then
	ngx.log(ngx.ERR, "没有访问权限")
	ngx.exit(404)
	return
end

local data = res.data.data

local raw_base_url = data.raw_base_url
local token = token_map[data.token] or data.token
for key, value in pairs(dns_map) do
	raw_base_url = string.gsub(raw_base_url, key, value)
end

ngx.var.dst_uri = raw_base_url .. ngx.var.request_uri
log("request is ok => " .. ngx.var.dst_uri)
log("token is => " ..  token)

ngx.req.set_header("PRIVATE-TOKEN", token)

return
