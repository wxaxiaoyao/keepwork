-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = require("orm/orm")

-- user 表
local site_group = commonlib.inherit(orm)

--function user:ctor()
site_group:tablename("site_group")
site_group:addfield("site_group_id", "number")
site_group:addfield("username","string")
site_group:addfield("sitename","string")
site_group:addfield("groupname","string")
site_group:addfield("level", "number")
site_group:addfield("create_time", "string")
site_group:addfield("update_time", "string")
--end


-- 设置站点组
function site_group:set_site_group(params)
	if not params.username or not params.sitename or not params.groupname then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end
	
	params.level = params.level or const.USER_PRIVILEGE_NONE_LEVEL

	local err = self:upsert({
		username = params.username, 
		sitename = params.sitename,
		groupname = params.groupname, 
	}, params)

	return errors:wrap(err)
end

-- 通过组名获取
function site_group:get_by_user_group_name(params)
	if not params.username or not params.groupname then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end
	
	local data = self:find({
		username = params.username, 
		groupname = params.groupname, 
	})

	return errors:wrap(nil, data)
end
-- 删除站点组
function site_group:delete_by_groupname(params)
	if not params.username or not params.sitename or not params.groupname then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end
	
	local err = self:delete({
		username = params.username, 
		sitename = params.sitename,
		groupname = params.groupname, 
	})

	return errors:wrap(err)
end

-- 删除所有站点组
function site_group:delete_by_sitename(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end
	
	local err = self:delete({
		username = params.username, 
		sitename = params.sitename,
	})

	return errors:wrap(err)
end


-- 删除用户所有站点组
function site_group:delete_by_username(params)
	if not params.username then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end
	
	local err = self:delete({
		username = params.username, 
	})

	return errors:wrap(err)
end


return site_group
