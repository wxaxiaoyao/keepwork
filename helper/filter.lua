
-- 获取认证信息
nws.http:register_filter(function(ctx, next_filter)
	local auth_str = ctx.request.headers['authorization']
	local token = auth_str and auth_str:match("(%S+)$")
	ctx.token = nws.util.decode_jwt(token)

	--nws.log(ctx.request.headers)

	if ctx.token then
		ctx.username = ctx.token.username
		ctx.user_id = ctx.token.user_id
	end
	
	next_filter()
end)


-- cros
nws.http:register_filter(function(ctx, next_filter)
	ctx.response:set_header("Access-Control-Allow-Origin", "*")
	ctx.response:set_header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE")
	ctx.response:set_header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With, Authorization")
	
	if ctx.request.method == "OPTIONS" then
		return ctx.response:send()
	end

	next_filter()
end)
