-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = nws.gettable("nws.orm")
local favorite = nws.inherit(orm)


favorite:tablename("favorite")
favorite:addfield("favorite_id", "number")
favorite:addfield("username","string")  -- 用户名
favorite:addfield("classify","string")  -- 分类
favorite:addfield("url","string")       -- url
favorite:addfield("create_time", "string")
favorite:addfield("update_time", "string")

-- 增改记录
function favorite:set_favorite(params)
	if not params.username or not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:upsert({
		username = params.username,
		url = params.url,
	}, params)

	return (errors:wrap(err))
end

-- 删除记录
function favorite:delete(params)
	if not params.username or not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:delete({
		username = params.username,
		url = params.url,
	})

	return (errors:wrap(err))
end

-- 获得用户收藏量
function favorite:get_count_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local count = self:count({username=params.username})

	return nil, count
end

-- 获得用户收藏的作品
function favorite:get_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local list = self:find({username=params.username})

	return nil, list
end

-- 删除用户的收藏
function favorite:delete_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:delete({username=params.username})

	return errors:wrap(err)
end


return favorite
