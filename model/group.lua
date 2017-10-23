-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = require("orm/orm")

-- user 表
local group = common.inherit(orm)

--function user:ctor()
group:tablename("group")
group:addfield("group_id", "number")
group:addfield("username","string")
group:addfield("groupname","string")
group:addfield("create_time", "string")
group:addfield("update_time", "string")
--end

-- 设置组
function group:set_group(params)
	if not params.username or not params.groupname then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:upsert({username = params.username, groupname = params.groupname}, params)

	return errors:wrap(err)
end


-- 删除组
function group:delete_by_name(params)
	if not params.username or not params.groupname then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:delete({username = params.username, groupname = params.groupname})

	return errors:wrap(err)
end

-- 删除用户组
function group:delete_by_name(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:delete({username = params.username})

	return errors:wrap(err)
end

return group
