
local orm = nws.gettable("nws.orm")

local user_file = nws.inherit(orm)

user_file:tablename("user_file")
user_file:addfield("user_file_id", "number")
user_file:addfield("username", "username")
user_file:addfield("path", "string")
user_file:addfield("access_level", "number")


-- 通过用户名获取用户文件列表
function user_file:get_by_username(params)
	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	local list = self:find({username=params.username})

	return nil, list
end
