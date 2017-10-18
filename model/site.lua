-- title: site
-- author: xiaoyao
-- date: 2017-10-09

local orm = require("orm/orm")

local site_data_source_model = require("model/site_data_source")

-- site 表
local site = commonlib.inherit(orm)

--function user:ctor()
site:tablename("site")
site:addfield("site_id", "number")
site:addfield("site_type", "number")
site:addfield("site_data_source_id", "number")
site:addfield("username","string")
site:addfield("sitename","string")
site:addfield("visibility","string")
site:addfield("index","string")
site:addfield("tags","string")
site:addfield("logo","string")
site:addfield("desc","string")
site:addfield("create_time", "string")
site:addfield("update_time", "string")
--end


-- 通过用户名站点名获取站点
function site:get_by_name(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({username=params.username, sitename=params.sitename})

	return errors:wrap(nil, data)
end

-- 通过id获取站点
function site:get_by_id(params)
	if not params.site_id then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find_one({site_id = params.site_id})

	return errors:wrap(nil, data)
end

-- 通过用户名获取站点列表
function site:get_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find({username=params.username})


	return errors:wrap(nil, data)
end

-- 通过用户名站点修改
function site:set_by_name(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:update({username=params.username, sitename=params.sitename}, params)

	return errors:wrap(err)
end

-- 获取站点及数据源通过站点名
--function site:get_with_ds_by_name(params)
	--local result = self:get_by_name(params)
	--if result:is_error() or not result.data then
		--return result
	--end

	--local siteinfo = result.data
--end

-- 创建站点
function site:create(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local ret = self:get_by_name(params)
	if ret.data then
		return errors:wrap("站点已存在")
	end

	local err = self:insert(params)
	if err then
		return errors:wrap(err)
	end

	return self:get_by_name(params)
end

-- 删除站点
function site:delete_site(params)
	local err = self:delete(params)
	return errors:wrap(err)
end

return site
