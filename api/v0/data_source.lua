local data_source = commonlib.inherit()

local data_source_model = require("model/data_source")
local convert_model = require("model/convert")


function data_source:getByUsername(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local result = data_source_model:get_by_username(params)

	result.data = convert_model.list_convert(result.data, convert_model.data_source_new_to_old)

	return result
end


function data_source:setDataSource(params)
	params = convert_model.data_source_old_to_new(params)

	local result = data_source_model:set_data_source(params)
	if result:is_error() then
		return result
	end
	
	return data_source_model:get_by_name(params)
end

return data_source
