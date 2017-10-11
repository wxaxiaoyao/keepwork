
local group = commonlib.inherit()

local group_model = require("model/group")


function group:upsert(params)
	if not params.username or not params.groupname then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	return group_model:set_group(params)
end

function group:deleteByName(params)
	return group_model:delete_by_name(params)
end

return group
