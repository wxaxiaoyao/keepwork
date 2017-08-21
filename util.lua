-- 加载第三方服务
local cjson = require("cjson")
local cjson_safe = require("cjson.safe")
local jwt = require("luajwt")

local util = {}

function util.console(msg)
	if type(msg) == "table" then
		msg = util.toJson(msg)
	elseif type(msg) == "function" then
		msg = tostring(msg)
	end

	print(msg)
end

-- json 编码
function util.toJson(t)
	return cjson_safe.encode(t)
end

-- json 解码
function util.fromJson(s)
	return cjson_safe.decode(s)
end

-- jwt 编码
function util.encodeJWT(payload, secret, expire)
	local alg = "HS256"
	payload = payload or {}
	secret = secret or "keepwork"
	payload.iss = "xiaoyao"
	payload.nbf = os.time()
	payload.exp = os.time() + (expire or 3600)

	local token, err = jwt.encode(payload, secret, alg)

	return token
end

-- jwt 编码
function util.decodeJWT(token, secret)
	secret = secret or "keepwork"
	local payload, err = jwt.decode(token, secret)
	
	return payload
end


return util
