-- title: page permission
-- author: xiaoyao
-- date: 2017-9-28

local orm = commonlib.gettable("nws.orm")
local page_permission = nws.inherit(orm)

page_permission:tablename("page_permission")
page_permission:addfield("page_permission_id", "number")
page_permission:addfield("path", "string")
page_permission:addfield("group_id", "number")
page_permission:addfield("group_level", "string")
