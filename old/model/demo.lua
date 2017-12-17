
-- DB模型测试  

local nws = commonlib.gettable("nws")
local orm = commonlib.gettable("nws.orm")
local demo = nws.inherit(orm)

demo:tablename("demo")                   -- 表名
--demo:addfield("demo_id", "number", "ID")       -- 主键id
demo:addfield("username", "string", "用户名")      -- 用户名字段
demo:addfield("password", "string", "密码")      -- 密码字段


function demo:add(x, y)
	return x + y
end

return demo
