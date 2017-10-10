

local convert_model = require("model/convert")
local site_data_source_model = require("model/site_data_source")

local site_data_source = commonlib.inherit()

-- 通过用户名获取数据源
function site_data_source:getByUsername(params, req, resp)

	local result = site_data_source_model:get_by_username(params)

	result.data = convert_model.list_convert(result.data, convert_model.site_data_source_new_to_old)

	return result
end

function site_data_source:updateById(params, req, resp)
	params = convert_model.site_data_source_old_to_new(params)
	
	return site_data_source_model:update_by_id(params)
end
return site_data_source
