
local orm = require("orm/orm")
local test = common.inherit(orm)

test:tablename("test")
test:addfield("test_id", "number")
test:addfield("username","string")
test:addfield("password","string")

return test
