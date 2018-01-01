
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
ngx.log(ngx.ERR, "this is a test");
ngx.exit(500);
