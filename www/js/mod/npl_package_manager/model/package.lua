
local orm = commonlib.gettable("nws.orm")
local package = nws.inherit(orm)

package:tablename("wikimod_package")
package:addfield("package_id")
package:addfield("username", "string") -- 用户名
package:addfield("name", "string")     -- 包名
package:addfield("version", "string")  -- 版本
package:addfield("config", "string")   -- 包配置
package:addfield("filename", "string") -- zip filename

-- 增改包记录
function package:set(params)
	if not params.username or not params.name or not params.version then
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	local err = self:upsert({
		username = params.username,
		name = params.name,
		version = params.version,
	}, params)
	

	return err
end

-- 通过名字获取包列表
function package:get_by_name(params)
	if not params.name then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local data = self:find({
		name = params.name,
	})

	return data
end

-- 通过包名跟版本获取
function package:get_by_name_version(params)
	if not params.name or not params.version then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local data = self:find({
		name = params.name,
		version = params.version,
	})

	return data
end

return package

