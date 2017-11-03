
local nws = commonlib.gettable("nws")
local orm = commonlib.gettable("nws.orm")
local test = nws.inherit(orm)

test:tablename("test")
test:addfield("test_id", "number")
test:addfield("username","string")
test:addfield("password","string")

return test
