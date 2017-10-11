-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local orm = require("orm/orm")

-- user 表
local site_user = commonlib.inherit(orm)

--function user:ctor()
site_user:tablename("site_user")
site_user:addfield("site_user_id", "number")
site_user:addfield("username","string")
site_user:addfield("sitename","string")
site_user:addfield("groupname","string")
site_user:addfield("membername","string")
site_user:addfield("level", "number")
site_user:addfield("create_time", "string")
site_user:addfield("update_time", "string")
--end



