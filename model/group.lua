-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = nws.gettable("nws.orm")

-- user 表
local group = nws.inherit(orm)

--function user:ctor()
group:tablename("group")
group:addfield("group_id", "number")
group:addfield("username","string")
group:addfield("groupname","string")
group:addfield("visibility","string")
group:addfield("create_time", "string")
group:addfield("update_time", "string")
--end

-- 设置组
function group:set_group(params)
	if not params.username or not params.groupname then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:upsert({username = params.username, groupname = params.groupname}, params)
	if err then
		return (errors:wrap(err))
	end

	return nil
end

-- 获取用户自己的组
function group:get_by_username(params) 
	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local datas = self:find({username=params.username})

	return nil, datas
end

-- 删除组
function group:delete_by_groupname(params)
	if not params.username or not params.groupname then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:delete({username = params.username, groupname = params.groupname})
	if err then
		return (errors:wrap(err))
	end

	return nil
end

-- 删除用户组
function group:delete_by_username(params)
	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:delete({username = params.username})
	if err then
		return (errors:wrap(err))
	end

	return nil
end

return group
