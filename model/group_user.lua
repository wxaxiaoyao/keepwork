-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = nws.gettable("nws.orm")

-- user 表
local group_user = nws.inherit(orm)

--function user:ctor()
group_user:tablename("group_user")
group_user:addfield("group_user_id", "number")
group_user:addfield("group_id", "number")
group_user:addfield("username","string")
group_user:addfield("groupname","string")
group_user:addfield("membername","string")
group_user:addfield("level","number")
group_user:addfield("create_time", "string")
group_user:addfield("update_time", "string")
--end

-- 增改组成员
function group_user:set_group_user(params)
	if not params.username or not params.groupname or not params.membername then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	local err, data = self:upsert({
		username = params.username, 
		groupname = params.groupname, 
		membername = params.membername,
	}, params)

	return err
end

-- 删除组成员
function group_user:delete_group_membername(params)
	if not params.username or not params.groupname or not params.membername then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:delete({
		username = params.username, 
		groupname = params.groupname, 
		membername = params.membername,
	})

	return err
end

-- 通过用户名组名获取
function group_user:get_by_user_group_name(params)
	if not params.username or not params.groupname then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local data = self:find({
		username = params.username, 
		groupname = params.groupname, 
	})

	return nil, data
end

-- 通过成员名获取组
function group_user:get_by_membername(params)
	if not params.membername then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find({membername=params.membername})

	return errors:wrap(nil, data)
end





-- 删除组
function group_user:delete_by_groupname(params)
	if not params.username or not params.groupname then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:delete({
		username = params.username, 
		groupname = params.groupname, 
	})

	return errors:wrap(err)
end

-- 删除用户组
function group_user:delete_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:delete({
		username = params.username, 
	})

	return errors:wrap(err)
end

return group_user
