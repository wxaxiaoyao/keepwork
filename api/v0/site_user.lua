
local site_user = commonlib.inherit()

local convert_model = require("model/convert")
local site_model = require("model/site")
local site_group_model = require("model/site_group")
local group_user_model = require("model/group_user")
local site_data_source_model = require("model/site_data_source")






-- 获得用户所有参与的站点
function site_user:getSiteListByMemberName(params)
	params.membername = params.memberName
	local data = group_user_model:get_by_membername(params).data

	local sitelist = {}
	local result = {}
	for _, x in ipairs(data or {}) do
		local site_group_l = site_group_model:get_by_user_group_name(x).data
		for _, site_group_x in ipairs(site_group_l or {}) do
			if site_group_x and site_group_x.level > const.USER_PRIVILEGE_READ_LEVEL then
				local siteinfo = site_model:get_by_name(site_group_x).data
				local dsinfo = site_data_source_model:get_by_id({site_data_source_id=siteinfo.site_data_source_id}).data
				siteinfo = convert_model.site_new_to_old(siteinfo)
				siteinfo.dataSource = convert_model.site_data_source_new_to_old(dsinfo)
				sitelist[#sitelist+1] = siteinfo
				result[#result+1] = {siteinfo = siteinfo}
			end
		end
	end

	return errors:wrap(nil, result)
end

return site_user
