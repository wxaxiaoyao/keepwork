local cjson = require("cjson")
local cjson_safe = require("cjson.safe")

local config = require("config")
local log = require("log")
local util = require("util")

local dns_map = {
	["gitlab.com"] = "52.167.219.168",
}

local token_map = config.data_source_token


local method = ngx.req.get_method()
local args = ngx.req.get_uri_args() or {}
local headers = ngx.req.get_headers();

local proxyurlprefix = headers["proxyurlprefix"] or  args.proxyurlprefix or ""
local proxytoken = headers["proxytoken"] or args.proxytoken or ""
local proxygittype= headers["proxygittype"] or "gitlab"
local privatetoken = headers["private-token"]

log(headers)
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

-- jwt 算法结果不一致， 方式取消  TODO 待完善
--if proxytoken and privatetoken then
	--local token = util.decode_jwt(proxytoken)
	--local dst_username = string.match(file_path, "([^_]+)")
--end

local res = util.get_url({
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
