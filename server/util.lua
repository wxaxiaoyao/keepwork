-- 加载第三方服务
local cjson = require("cjson")
local cjson_safe = require("cjson.safe")
local jwt = require("luajwt")
local md5 = require("md5")
local requests = require("requests")

local util = {}

-- 控制台输出
function util.console(msg)
	if type(msg) == "table" then
		msg = util.toJson(msg)
	elseif type(msg) == "function" then
		msg = tostring(msg)
	end

	print(msg)
end

-- web 输出
function util.say(msg)
	if type(msg) == "table" then
		msg = util.toJson(msg)
	elseif type(msg) == "function" then
		msg = tostring(msg)
	end

	ngx.say(msg)
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

-- 获取共享字典
util.getSharedDict = function()
	return ngx.shared.shared_dict
end


function util.request_url(params)
	local method = params.method

	if params.data and type(params.data) == "table" then
		if params.headers then
			params.headers['Content-Type'] = params.headers['Content-Type'] or "application/json"
		else
			params.headers = {['Content-Type'] = "application/json"}
		end
	end
	--local res = nil

	--params.method = nil
	--if method == "GET" then
		--res = requests.get(params)	
	--elseif method == "POST" then
		--res = requests.post(params)	
	--end
	--res:{headers:{}, text:string, status_code:number}
	local res = requests.request(method, params)

	res.data = res.json()

	return res
end

function util.md5(msg)
	return md5.sumhexa(msg)
	--return msg
end

return util
