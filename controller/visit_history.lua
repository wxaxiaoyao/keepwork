
local controller = nws.gettable("nws.controller")
local visit_history = controller:new("visit_history")

local visit_history_model = nws.import("model/visit_history")

-- 获得用户访问历史
function visit_history:get_by_username(ctx)
	local params = ctx.request:get_params()

	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = visit_history_model:get_by_username(params)

	return (errors:wrap(err, data))
end


return visit_history
