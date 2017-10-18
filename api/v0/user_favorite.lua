
local user_favorite = commonlib.inherit()

local favorite_model = require("model/favorite")
local user_model = require("model/user")
local site_model = require("model/site")


function user_favorite:getUserByUserId(params)
	params.user_id = params.userId

	return user_model:get_by_id(params).data
end

function user_favorite:getSiteBySiteId(params)
	params.site_id = params.siteId

	return site_model:get_by_id(params).data
end

function user_favorite:favoriteSite(params)
	if not params.userId or not params.siteId then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local userinfo = user_model:get_by_id({user_id=params.userId}).data
	local siteinfo = site_model:get_by_id({site_id=params.siteId}).data
	
	if not userinfo or not siteinfo then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	extra_data = {userinfo = userinfo, siteinfo = siteinfo}

	return favorite_model:set_favorite({
		username = userinfo.username,
		favorite_username = siteinfo.username,
		favorite_sitename = siteinfo.sitename,
		extra_data = util.toJson(extra_data),
	})
end

function user_favorite:unfavoriteSite(params)
	if not params.userId or not params.siteId then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end

	local userinfo = user_model:get_by_id({user_id=params.userId}).data
	local siteinfo = site_model:get_by_id({site_id=params.siteId}).data

	if not userinfo or not siteinfo then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	return favorite_model:set_favorite({
		username = userinfo.username,
		favorite_username = siteinfo.username,
		favorite_sitename = siteinfo.sitename,
	})
end

function user_favorite:getByUserId(params)
	if not params.userId then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end

	local userinfo = user_model:get_by_id({user_id=params.userId}).data

	if not userinfo then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local list = favorite_model:get_by_username({username = userinfo.username}).data or {}

	return errors:wrap(nil, {total = #list, list = list})
end


function user_favorite:getBySiteId(params)
	if not params.siteId then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local siteinfo = site_model:get_by_id({site_id=params.siteId}).data
	if not siteinfo then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local list = favorite_model:get_by_user_site_name({username=siteinfo.username, sitename=siteinfo.sitename}).data or {}

	return errors:wrap(nil, {total = #list, list = list})
end

function user_favorite:deleteByUserId(params)
	if not params.userId then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local userinfo = user_model:get_by_id({user_id=params.userId}).data

	if not userinfo then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	return favorite_model:delete_by_username({username = userinfo.username})
end

return user_favorite
