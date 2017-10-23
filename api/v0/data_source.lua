local data_source = common.inherit()

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


-- 
function data_source:setDataSource(params)
	params = convert_model.data_source_old_to_new(params)

	local result = data_source_model:set_data_source(params)
	if result:is_error() then
		return result
	end
	
	local data = data_source_model:get_by_name(params).data

	data = convert_model.data_source_new_to_old(data)

	return errors:wrap(nil, data)
end

-- 获取数据源记录
function data_source:get(params)
	local data = data_source_model:get(params).data

	data = convert_model.list_convert(data, convert_model.data_source_new_to_old)

	return errors:wrap(nil, data)
end


return data_source
