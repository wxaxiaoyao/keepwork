
local controller = nws.gettable("nws.controller")
local data_source = controller:new("data_source")
local data_source_model = nws.import("model/data_source")


-- 获取用户所有数据源信息
function data_source:get(ctx)
	local username = ctx.username
	if not username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, datas = data_source_model:get_by_username({username=username})

	return errors:wrap(err, datas)
end

-- 增改数据源
function data_source:set_data_source(params)
	local result = data_source_model:set_data_source(params)
	if result:is_error() then
		return result
	end
	
	local data = data_source_model:get_by_name(params).data

	return errors:wrap(nil, data)
end


return data_source
