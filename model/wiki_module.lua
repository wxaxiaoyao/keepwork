-- title: vip
-- author: xiaoyao
-- date: 2017-9-28

local orm = require("orm/orm")

local wiki_module = common.inherit(orm)

-- define table
wiki_module:tablename("wiki_module")
wiki_module:addfield("wiki_module_id", "number")
wiki_module:addfield("cmd_name", "string")
wiki_module:addfield("module_name", "string")
wiki_module:addfield("module_logo", "string")
wiki_module:addfield("classify_name", "string")
wiki_module:addfield("classify_id", "number")
wiki_module:addfield("content", "string")
wiki_module:addfield("desc", "string")
wiki_module:addfield("flag", "number")
wiki_module:addfield("use_count", "number")
wiki_module:addfield("favorite_count", "number")
wiki_module:addfield("create_time", "string")
wiki_module:addfield("update_time", "string")



function wiki_module:add_module(params)
	if not params.cmd_name then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:upsert({cmd_name = params.cmd_name}, params)
end


