-- title: vip
-- author: xiaoyao
-- date: 2017-9-28


local orm = require("orm/orm")

local wiki_module_classify = common.inherit(orm)

-- define table
wiki_module_classify:tablename("wiki_module_classify")
wiki_module_classify:addfield("wiki_module_classify_id", "number")
wiki_module_classify:addfield("classify_name", "string")
wiki_module_classify:addfield("desc", "string")
wiki_module_classify:addfield("create_time", "string")
wiki_module_classify:addfield("update_time", "string")



-- 获得全部记录
function wiki_module_classify:get(params)
	local list = self:find()

	return errors:wrap(nil, list)
end


-- 添加分类
function wiki_module_classify:add_classify(params)
	if not params.classify_name then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local err = self:upsert({classify_name=params.classify_name}, params)

	return errors:wrap(err)
end


return wiki_module_classify
