
local controller = nws.gettable("nws.controller")
local group = controller:new("group")

local group_model = nws.import("model/group")
local group_user_model = nws.import("model/group_user")

-- 增改组
function group:set_group(ctx)
	local params = ctx.request:get_params()

	params.username = ctx.username

	local err = group_model:set_group(params)

	return errors:wrap(err)
end

-- 删除组
function group:delete_group(ctx)
	local params = ctx.request:get_params()
	params.username = ctx.username

	if not params.username or not params.groupname then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	-- 删除组用户
	local err = group_user_model:delete_by_groupname(params)
	if err then
		return (errors:wrap(err))
	end

	local err = group_model:delete_by_groupname(params)

	return errors:wrap(err)
end

-- 获取用户组 TODO 分页支持
function group:get(ctx) 
	local username = ctx.username

	if not username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = group_model:get_by_username({username=username})

	return errors:wrap(err, data)
end

-- 获取用户可用的组
function group:get_all(ctx) 
	local username = ctx.username

	local list = {}
	local err, data = group_model:get_by_username({username=username})

	for _, x in ipairs(data or {}) do
		list[#list+1] = x
	end


	err, data = group_user_model:get_by_membername({membername=username})
	for _, x in ipairs(data or {}) do
		local tmp = group_model:find_one({username=x.username, groupname=x.groupname, visibility="public"})
		if tmp then
			list[#list+1] = tmp
		end
	end

	return errors:wrap(nil, list)
end

return group
