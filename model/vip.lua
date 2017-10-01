-- title: vip
-- author: xiaoyao
-- date: 2017-9-28


local orm = require("orm/orm")

local vip = commonlib.inherit(orm)

-- define table
vip:tablename("vip")
vip:addfield("vip_id", "number")
vip:addfield("username", "string")
vip:addfield("level", "number")
vip:addfield("start_date", "string")
vip:addfield("end_date", "string")
vip:addfield("create_time", "string")
vip:addfield("update_time", "string")

function vip:get_by_username(params)
	if not params.username then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local vip_info = self:find_one({username=params.username})
	local cur_date = commonlib.get_date()

	if not vip_info then
		vip_info = {
			username=params.username,
			level=0,
			start_date=cur_date,
			end_date="",
		}
		local ok, msg = self:insert(vip_info)
		if ok == nil then
			return errors:wrap(errors:new("创建vip信息失败"), msg)
		end
	end

	if vip_info.start_date <= cur_date and cur_date <= vip_info.end_date then
		vip_info.is_valid = true
	else
		vip_info.is_valid = false
	end

	return errors:wrap(nil, vip_info)
end

return vip
