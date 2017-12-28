-- title: page permission
-- author: xiaoyao
-- date: 2017-9-28

local orm = commonlib.gettable("nws.orm")
local file_group = nws.inherit(orm)

file_group:tablename("file_group")
file_group:addfield("file_group_id", "number")
file_group:addfield("username", "string")
file_group:addfield("path", "string")
file_group:addfield("group_username", "string")
file_group:addfield("groupname", "number")
file_group:addfield("level", "string")


-- 添加记录
function file_group:set_file_group(params)
	if not params.username or not params.path or not params.group_username or not params.groupname then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	params.level = params.level or const.FILE_ACCESS_READ_LEVEL
	local idname = self:get_idname()
	local idvalue = params[idname]

	local err = nil
	if idname then
		err = self:update({[idname]=idvalue}, params)
	else 
		err = self:insert(params)
	end

	return err
end

-- 获取用户记录
function file_group:get_by_username(params) 
	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local data = self:find({username=params.username})

	return nil, data
end

return file_group
