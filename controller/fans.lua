
local controller = nws.gettable("nws.controller")
local fans = controller:new("fans")

local fans_model = nws.import("model/fans")
local user_model = nws.import("model/user")

-- 获取用户粉丝列表
function fans:get_fans_by_username(ctx)
	local params = ctx.request:get_params()

	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end
	
	local err, data = fans_model:get_by_username(params)

	return (errors:wrap(err, data))
end

-- 获取关注列表
function fans:get_follows_by_username(ctx) 
	local params = ctx.request:get_params()

	if not params.fans_username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = fans_model:get_by_fans_username(params)

	return (errors:wrap(err, data))
end

-- 是否关注
function fans:is_followed(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	params.fans_username = username
	if not params.username or not params.fans_username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end
	
	local err = fans_model:get_one(params)

	return (errors:wrap(err))
end

-- 关注某人
function fans:follow(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	params.fans_username = username
	if not params.username or not params.fans_username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end
	
	local userinfo = user_model:get_by_username({username = params.username})
	local fans_userinfo = user_model:get_by_username({username = params.fans_username})

	params.portrait = userinfo.portrait
	params.nickname = userinfo.nickname
	params.fans_portrait = fans_userinfo.portrait
	params.fans_nickname = fans_userinfo.nickname
	
	local err = fans_model:set_fans(params)

	return (errors:wrap(err))
end

-- 取消关注
function fans:unfollow(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	params.fans_username = username
	if not params.username or not params.fans_username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end
	
	local err = fans_model:delete_one(params)

	return (errors:wrap(err))
end

return fans
