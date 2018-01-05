
local orm = nws.gettable("nws.orm")
local visit_history = nws.inherit(orm)

visit_history:tablename("visit_history")
visit_history:addfield("visit_history_id", "number")
visit_history:addfield("username", "string")
visit_history:addfield("url", "string")
visit_history:addfield("create_time", "string")
visit_history:addfield("update_time", "string")

-- 增改用户访问历史
function visit_history:set(params)
	if not params.username or not params.url then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:upsert({
		username = params.username,
		url = params.url,
	}, params)

	return err
end


-- 获取用户访问历史
function visit_history:get_by_username(params)
	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local tabledb = self:db()
	local table = tabledb[self:get_tablename()]

	local err, data = table:find({["+username-update_time"] = {params.username, skip = params.skip, limit = params.limit}})

	return err, data
end


return visit_history
