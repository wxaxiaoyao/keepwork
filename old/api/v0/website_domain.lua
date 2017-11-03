
local website_domain = common.inherit()

local domain_model = require("model/domain")
--local user_model = require("model/user")
--local convert_model = require("model/convert")


function website_domain:insert(params)
	if not params.domain or not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end
	
	return domain_model:set_domain(params)
end

function website_domain:deleteByDomain(params)
	if not params.domain then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	return domain_model:delete_domain(params)
end

function website_domain:getByName(params)
	if not params.username or not params.sitename then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	return domain_model:get_by_name(params)
end

return website_domain
