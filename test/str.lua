
local str = "/12/23"

print(table.concat({"hello", "world"},'/'))
print(string.gsub(str, '/[%w%d]+$', ''))

print(string.match(str, '[%d%.]+'))
