
local controller = nws.gettable("nws.controller")
local group = controller:new("group")

local group_model = nws.import("model/group")

-- 增改组
function group:upsert(params)
	if not params.username or not params.groupname then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local err = group_model:set_group(params)

	return errors:wrap(err)
end

-- 删除组
function group:deleteByName(params)
	return errors:wrap(group_model:delete_by_name(params))
end

return group
