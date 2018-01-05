
local controller = nws.gettable("nws.controller")
local favorite = controller:new("favorite")

local favorite_model = require("model/favorite")
local user_model = require("model/user")

-- 收藏页面
function favorite:favorite_page(ctx)
	local username = ctx.username
	local params = ctx.request.get_params()

	params.username = username
	
	if not params.username or not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = favorite_model:set_favorite(params)

	return (errors:wrap(err))
end

-- 解除收藏页
function favorite:unfavorite_page(ctx)
	local username = ctx.username
	local params = ctx.request.get_params()
	
	params.username = username

	if not params.username or not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = favorite_model:delete(params)

	return (errors:wrap(err))
end

-- 获取用户所有收藏页
function favorite:get_by_username(ctx)
	local params = ctx.request:get_params()

	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = favorite_model:get_by_username(params)

	return (errors:wrap(err, data))
end

return favorite
