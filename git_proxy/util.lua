local requests = require("requests")
local luajwt = require("luajwt")


local util = {}


-- jwt 编码
function util.encode_jwt(payload, secret, expire)
	local alg = "HS256"
	payload = payload or {}
	secret = secret or "keepwork"
	payload.exp = os.time() + (expire or 3600)

	local token, err = luajwt.encode(payload, secret, alg)

	return token
end

-- jwt 编码
function util.decode_jwt(token, secret)
	if not token then
		return nil
	end

	secret = secret or "keepwork"
	local payload, err = luajwt.decode(token, secret)
	print(err)
	return payload
end

function util.get_url(params)
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

return util
