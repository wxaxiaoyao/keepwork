-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = nws.gettable("nws.orm")

local fans = nws.inherit(orm)

fans:tablename("fans")
fans:addfield("fans_id", "number")
fans:addfield("username","string")
fans:addfield("nickname", "string")
fans:addfield("portrait", "string")
fans:addfield("fans_username", "string")
fans:addfield("fans_nickname", "string")
fans:addfield("fans_portrait", "string")
fans:addfield("create_time", "string")
fans:addfield("update_time", "string")


-- 增改记录
function fans:set_fans(params)
	if not params.username or not params.fans_username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:upsert({
		username = params.username,
		fans_username = params.fans_username,
	}, params)

	return errors:wrap(err)
end

-- 是否已经关注
function fans:get_one(params)
	if not params.username or not params.fans_username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({
		username = params.username,
		fans_username = params.fans_username,
	})

	return nil, data
end

-- 删除
function fans:delete_one(params)
	if not params.username or not params.fans_username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:delete({
		username = params.username,
		fans_username = params.fans_username,
	})

	return errors:wrap(err)
end

-- 获得用户粉丝数量
function fans:get_count_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local total = self:count({username = params.username})

	return nil, total 
end

-- 获得用户的粉丝
function fans:get_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local list = self:find({username = params.username})

	return nil, list
end

-- 获得用户关注
function fans:get_by_fans_username(params)
	if not params.fans_username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local list = self:find({fans_username = params.fans_username})

	return nil, list
end

-- 是否关注
function fans:is_fans(params)
	if not params.username or not params.fans_username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({username = params.username, fans_username = params.fans_username})
	
	if not data then
		return nil, 0
	end

	return nil, 1
end

return fans
