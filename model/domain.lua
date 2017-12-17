-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = require("orm/orm")

-- user 表
local domain = common.inherit(orm)

--function user:ctor()
domain:tablename("domain")
domain:addfield("domain_id", "number")
domain:addfield("domain","string")
domain:addfield("username","string")
domain:addfield("sitename","string")
domain:addfield("create_time", "string")
domain:addfield("update_time", "string")
--end


-- 设置域名
function domain:set_domain(params)
	if not params.domain or not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:upsert({domain = params.domain}, params)

	return errors:wrap(err)
end


-- 删除域名
function domain:delete_domain(params)
	if not params.domain then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	

	local err = self:delete({domain = params.domain})

	return errors:wrap(err)
end

-- 通过用户名站点名获取列表
function domain:get_by_name(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local data = self:find({username = params.username, sitename = params.sitename})

	return errors:wrap(nil, data)
end

return domain
