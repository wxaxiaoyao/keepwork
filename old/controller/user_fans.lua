
local user_fans = common.inherit()

local fans_model = require("model/fans")
local user_model = require("model/user")


function user_fans:getUserByUserId(params)
	params.user_id = params.userId

	return user_model:get_by_id(params).data
end

function user_fans:getCountByUserId(params)
	local userinfo = user_fans:getUserByUserId(params)
	if not userinfo then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	return fans_model:get_count_by_username({username=userinfo.username})
end

function user_fans:isAttented(params)
	if not params.userId or not params.fansUserId then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local username = self:getUserByUserId({userId=params.userId}).username
	local fans_username = self:getUserByUserId({userId=params.fansUserId}).username

	return fans_model:is_fans({username=username, fans_username=fans_username})
end

function user_fans:attent(params)
	if not params.userId or not params.fansUserId then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local userinfo = self:getUserByUserId({userId=params.userId})
	local fans_userinfo = self:getUserByUserId({userId=params.fansUserId})

	userinfo = user_model:filter(userinfo)
	fans_userinfo = user_model:filter(fans_userinfo)
	local extra_data = {userinfo = userinfo, fans_userinfo = fans_userinfo}
	return fans_model:set_fans({
		username=userinfo.username, 
		fans_username=fans_userinfo.username,
		extra_data = util.toJson(extra_data),
	})
end

function user_fans:unattent(params)
	if not params.userId or not params.fansUserId then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	local username = self:getUserByUserId({userId=params.userId}).username
	local fans_username = self:getUserByUserId({userId=params.fansUserId}).username

	return fans_model:delete_one({username=username, fans_username=fans_username})
end

return user_fans
