
local i = 1

local x = 2.0
local sum = 0
for i = 1, 30 do
	sum = sum + x
	x = sum * 2.0 / 1.7
	print(i, sum)
end

print(sum)

