
local fans = commonlib.inherit()

local fans_model = require("model/fans")


function fans:getCountByUsername(params)
	return fans_model:get_count_by_username(params)
end

return fans
