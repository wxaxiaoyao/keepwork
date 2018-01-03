
local orm = nws.gettable("nws.orm")
local user_visit_history = nws.inherit(orm)

user_visit_history:tablename("user_visit_history")
user_visit_history:addfield("user_visit_history_id", "number")
user_visit_history:addfield("username", "string")
user_visit_history:addfield("url", "string")
user_visit_history:addfield("create_time", "string")
user_visit_history:addfield("update_time", "string")

-- 增改用户访问历史
function user_visit_history:set(params)
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
function user_visit_history:get_by_username(params)
	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local tabledb = self:db()
	local table = tabledb[self:get_tablename()]

	local err, data = table:find({["+username-update_time"] = {params.username, skip = params.skip, limit = params.limit}})

	return err, data
end


return user_visit_history
