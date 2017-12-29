
local controller = nws.gettable("nws.controller")
local file_group = controller:new("file_group")

local file_group_model = nws.import("model/file_group")

-- 设置文件组
function file_group:set_file_group(ctx)
	local params = ctx.request:get_params()
	local username = ctx.username

	params.username = username

	local err = file_group_model:set_file_group(params)

	return (errors:wrap(err))
end

-- 获取用户文件组
function file_group:get_by_username(ctx)
	local username = ctx.username

	local err, data = file_group_model:get_by_username({username=username})

	return (errors:wrap(err, data))
end

-- 通过id删除
function file_group:delete_by_id(ctx)
	local params = ctx.request:get_params()
	local username = ctx.username

	if not username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = file_group_model:get_by_id(params)
	if not data or data.username ~= username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = file_group_model:delete_by_id(params)

	return (errors:wrap(err))
end

return file_group
