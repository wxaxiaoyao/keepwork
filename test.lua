local lfs = require("lfs")
local cjson = require("cjson")
local info = debug.getinfo(1)
for key, value in pairs(info) do
	print(key, ":", value)
end

print(lfs.currentdir)

