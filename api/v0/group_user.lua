
local group_user = common.inherit()

local convert_model = require("model/convert")
local site_model = require("model/site")
local site_group_model = require("model/site_group")
local group_user_model = require("model/group_user")
local site_data_source_model = require("model/site_data_source")


function group_user:upsert(params)
	params.membername = params.memberName

	return group_user_model:set_group_user(params)
end


function group_user:deleteMember(params)
	params.membername = params.memberName

	return group_user_model:delete_by_membername(params)
end


return group_user
