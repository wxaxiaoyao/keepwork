
local orm = nws.gettable("nws.orm")
local page = nws.inherit(orm)


page:tablename("page")
page:addfield("page_id", "number")
page:addfield("username", "string")
page:addfield("pagename", "string")
page:addfield("url", "string")
page:addfield("theme", "string") -- 页面内置theme
page:addfield("content", "string") -- 可选
page:addfield("visit_count", "number")
page:addfield("update_time", "string")
page:addfield("create_time", "string")


-- 设置用户页
function page:set_page(params)
	if not params.pagename or not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	return self:upsert({
		username = params.username,
		url = params.url,
	}, params)
end

-- 获取用户页
function page:get_by_url(params)
	if not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local data = self:find_one({url = params.url})

	return nil, data
end

-- 删除 
function page:delete_by_url(params)
	if not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:delete({url = params.url})

	return err
end

-- 获取最近更新页
function page:get_renew(params)
	local tabledb = self:db()
	local table = tabledb[self:get_tablename()]
	
	local key, value = "", {}

	if params.username then
		key = key .. "+username"
		value[#value+1] = params.username
	end

	key = key .. "-update_time"
	if params.update_time then
		value["gt"] = params.update_time
	end

	value["skip"] = params.skip
	value["limit"] = params.limit

	local err, data = table:find({[key] = value})

	return err, data
end


return page;
