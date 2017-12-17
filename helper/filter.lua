
-- 获取认证信息
nws.http:register_filter(function(ctx, next_filter)
	local auth_str = ctx.request.headers['authorization']
	local token = auth_str and auth_str:match("%s+(%S+)")
	ctx.token = nws.util.decode_jwt(token)
	
	next_filter()
end)
