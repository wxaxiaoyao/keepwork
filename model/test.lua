
local orm = nws.gettable("nws.orm")
local test = nws.inherit(orm)

test:tablename("test")
test:addfield("test_id", "number")
test:addfield("username","string")
test:addfield("password","string")

return test
