local orm = nws.gettable("nws.orm")

-- user 表
local file = nws.inherit(orm)

--function user:ctor()
file:tablename("file")
file:addfield("file_id", "number")
file:addfield("username","string")
file:addfield("path","string")
file:addfield("content","string")
file:addfield("create_time", "string")
file:addfield("update_time", "string")


-- 增改记录
function file:set_file(params)
	if not params.username or not params.path then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	if (string.find(params.path, params.username)) ~= 1 then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err, data = self:upsert({path=params.path}, params)

	return err, data 
end

-- 获取记录
function file:get_by_path(params)
	if not params.path then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local data = self:find_one({path=params.path})

	return nil, data
end

-- 获取文件内容
function file:get_content_by_path(params)
	local _, data = self:get_by_path(params)

	if not data then
		return ""
	end

	return data.content
end


