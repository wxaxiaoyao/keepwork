
local orm = nws.gettable("nws.orm")
local user_theme = nws.inherit(orm)

user_theme:tablename("user_theme")
user_theme:addfield("username", "string")
user_theme:addfield("path", "string")
user_theme:addfield("content", "string")


function user_theme:set_user_theme(params) 
	if not params.username or not params.path or not params.content then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local err = self:upsert({username=params.username}, params)

	return err
end


function user_theme:get_by_username(params)
	if not params.username then
		return (errors:wrap(errors.PARAMS_ERROR))
	end

	local data = self:find({username = params.username})

	return nil, data
end


return user_theme
