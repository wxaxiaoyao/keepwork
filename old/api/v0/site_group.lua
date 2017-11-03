
local site_group = common.inherit()

local convert_model = require("model/convert")
local site_model = require("model/site")
local site_group_model = require("model/site_group")
local group_user_model = require("model/group_user")
local site_data_source_model = require("model/site_data_source")


-- 获取站点组通过通过组名 用户名
function site_group:getByUserGroupName(params, req, resp)
	if not params.username or not params.groupname then
		return errors:wrap(errors.REQUEST_PARAMS_ERROR)
	end
	
	local result = site_group_model:get_by_user_group_name(params)

	local data = result.data or {}

	return errors:wrap(nil, {total=#data, groupList=data})
end


function site_group:upsert(params)
	params = convert_model.site_group_old_to_new(params)
	return site_group_model:set_site_group(params)
end

function site_group:deleteByName(params)
	return site_group_model:delete_by_groupname(params)
end

function site_group:deleteBySitename(params)
	return site_group_model:delete_by_sitename(params)
end

-- 获取用户用户编辑权限的站点
function site_group:getByMemberName(params)
	params.membername = params.memberName
	local data = group_user_model:get_by_membername(params).data

	local sitelist = {}
	for _, x in ipairs(data or {}) do
		local site_group_l = site_group_model:get_by_user_group_name(x).data
		for _, site_group_x in ipairs(site_group_l or {}) do
			if site_group_x and site_group_x.level > const.USER_PRIVILEGE_READ_LEVEL then
				local siteinfo = site_model:get_by_name(site_group_x).data
				local dsinfo = site_data_source_model:get_by_id({site_data_source_id=siteinfo.site_data_source_id}).data
				siteinfo = convert_model.site_new_to_old(siteinfo)
				siteinfo.dataSource = convert_model.site_data_source_new_to_old(dsinfo)
				sitelist[#sitelist+1] = siteinfo
			end
		end
	end

	return errors:wrap(nil, sitelist)
end

-- 通过用户名获取
function site_group:getByUsername(params)
	local data = site_group_model:get_by_username(params).data or {}

	return errors:wrap(nil,{total=#data, groupList=data})
end

-- 获取站点可读权限的用户列表
function site_group:getGuestUserList(params)
	local data = site_group_model:get_by_user_site_name(params).data

	local userlist = {}
	for _, x in ipairs(data or {}) do
		local group_user_l = group_user_model:get_by_user_group_name(x).data
		for _, y in ipairs(group_user_l or {}) do
			userlist[#userlist+1] = y.membername
		end
	end

	return errors:wrap(nil, userlist)
end

return site_group

