
local controller = nws.gettable("nws.controller")
local group_user = controller:new("group_user")

local group_user_model = nws.import("model/group_user")

-- 增改组成员
function group_user:set_group_user(ctx)
	local params = ctx.request:get_params()

	params.username = ctx.username
	params.level = params.level or 20 -- 默认只读

	local err = group_user_model:set_group_user(params)
	if err then
		return (errors:wrap(err))
	end

	return errors:wrap(nil)
end

-- 删除组成员
function group_user:delete_group_membername(ctx)
	local params = ctx.request:get_params()
	params.username = ctx.username
	local err = group_user_model:delete_group_membername(params)

	if err then
		return (errors:wrap(err))
	end

	return errors:wrap(nil)
end

-- 获取组用户
function group_user:get_by_user_group_name(ctx) 
	local params = ctx.request:get_params()
	params.username = ctx.username

	local err, data = group_user_model:get_by_user_group_name(params)
	if err then
		return (errors:wrap(err))
	end

	return errors:wrap(nil, data)
end

-- 获取用户所在组
function group_user:get_by_membername(ctx)
	local username = ctx.username

	if not username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = group_user_model:get_by_membername({membername=username})


	return errors:wrap(err, data)
end

return group_user
