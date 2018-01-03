
local controller = nws.gettable("nws.controller")
local user_visit_history = controller:new("user_visit_history")

local user_visit_history_model = nws.import("model/user_visit_history")

-- 获得用户访问历史
function user_visit_history:get_by_username(ctx)
	local params = ctx.request:get_params()

	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = user_visit_history_model:get_by_username(params)

	return (errors:wrap(err, data))
end


return user_visit_history
