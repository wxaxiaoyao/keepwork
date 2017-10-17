-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = require("orm/orm")

local favorite = commonlib.inherit(orm)

favorite:tablename("favorite")
favorite:addfield("favorite_id", "number")
favorite:addfield("username","string")
favorite:addfield("favorite_username","string")
favorite:addfield("favorite_sitename","string")
favorite:addfield("extra_data","string")
favorite:addfield("create_time", "string")
favorite:addfield("update_time", "string")


function favorite:set_favorite(params)
	if not params.username or not params.favorite_username or not params.favorite_sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:upsert({
		username = params.username,
		favorite_username = params.favorite_username,
		favorite_sitename = params.favorite_sitename,
	}, params)

	return errors:wrap(err)
end

function favorite:delete_one(params)
	if not params.username or not params.favorite_username or not params.favorite_sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:delete({
		username = params.username,
		favorite_username = params.favorite_username,
		favorite_sitename = params.favorite_sitename,
	})

	return errors:wrap(err)
end

-- 获得用户收藏量
function favorite:get_count_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local count = self:count({username=params.username})

	return errors:wrap(nil, count)
end

-- 获得用户收藏的作品
function favorite:get_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local list = self:find({username=params.username})

	return errors:wrap(nil, list)
end

-- 获取站点的收藏用户
function favorite:get_by_user_site_name(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local list = self:find({favorite_username=params.username, favorite_sitename=params.sitename})

	return errors:wrap(nil, list)
end

-- 删除用户的收藏
function favorite:delete_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:delete({username=params.username})

	return errors:wrap(err)
end
