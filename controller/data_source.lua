
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
function data_source:set_data_source(ctx)
	local params = ctx.request:get_params()
	params.username = ctx.username
	local err = data_source_model:set_data_source(params)
	if err then
		return (errors:wrap(err))
	end
	
	local data = data_source_model:get_by_name(params).data

	return errors:wrap(nil, data)
end

-- 获取默认数据源
function data_source:get_default_data_source(ctx) 
	local username = ctx.username
	if not username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local _, data = data_source_model:get_default_by_username({username=username})
	if not data then
		return (errors:wrap(errors.NOT_FOUND))
	end

	return errors:wrap(nil, data)
end

-- 设置默认数据源
function data_source:set_default_data_source(ctx)
	local username = ctx.username
	local params = ctx.request:get_params()

	if not username or not params.data_source_id then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	data_source_model:update({username=username, is_default=1}, {is_default=0})
	data_source_model:update({data_source_id=params.data_source_id}, {is_default=1})

	return errors:wrap(nil)
end

return data_source
