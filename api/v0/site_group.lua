
local site_group = commonlib.inherit()

local site_group_model = require("model/site_group")


function site_group:getByUserGroupName(params, req, resp)
	if not params.username or not params.groupname then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end
	
	local result = site_group_model:get_by_user_group_name(params)

	local data = result.data or {}

	return errors:wrap(nil, {total=#data, groupList=data})
end

return site_group
