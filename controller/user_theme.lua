
local controller = nws.gettable("nws.controller")
local user_theme = controller:new("user_theme")

local user_theme_model = nws.import("model/user_theme")


function user_theme:set_user_theme(ctx) 
	local params = ctx.request:get_params()

	params.username = ctx.username

	local err, data = user_theme_model:set_user_theme(params)

	return (errors:wrap(err, data))
end

function user_theme:get_by_username(ctx)
	local params = ctx.request:get_params()

	params.username = ctx.username

	local err, data = user_theme_model:get_by_username(params)

	return (errors:wrap(err, data))
end


function user_theme:get_best_match_by_path(ctx, params)
	local params = params or ctx.request:get_params()
	params.username = ctx.username
	
	if not params.path then
		return (errors:wrap(errors.PARAMS_ERROR))
	end
	
	local datas = user_theme_model:get_by_username(params)
	local path, data = nil

	for _, x in ipairs(datas or {}) do
		path = x.path
		path = string.gsub(path, "[^/]*$", "")
		if (string.find(params.path, path)) then
			if not data or #path > #data.path then
				data = x
			end
		end
	end

	return (errors:wrap(nil, data))
end
