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

local function log(t) 
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

--local auth_username = luajwt.
ngx.var.dst_uri = proxyurlprefix .. ngx.var.request_uri

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

	-- 部分接口直接放行
	if string.match(path, '/repository/tree$') then
		return 
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

--log(data)

log("request is ok => " .. ngx.var.dst_uri)
log("token is => " ..  data.token)

ngx.req.set_header("PRIVATE-TOKEN", data.token)

return
