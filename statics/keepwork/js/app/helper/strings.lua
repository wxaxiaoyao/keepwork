
local strings = {}

function strings:new(str) 
	obj = {}
	setmetatable(obj, self)
	self.__index = self

	obj.str = str
	obj.length = string.len(str)

	return obj
end

function strings:_split(sep)
	local list = {}
	local str = self.str .. sep

	for word in string.gmatch(str, '([^' .. sep .. ']*)' .. sep) do
		list[#list+1] = word
	end

	return list
end

function strings:_indexOf(substr) 
	return (string.find(self.str, substr))
end

function strings:_substring(s, e) 
	return string.sub(self.str, s, e)
end

function strings:_str()
	return self.str
end


function strings.split(str, sep) 
	local list = {}
	local str = str .. sep

	for word in string.gmatch(str, '([^' .. sep .. ']*)' .. sep) do
		list[#list+1] = word
	end

	return list
end

function strings.indexOf(str, substr) 
	return (string.find(str, substr))
end

function strings.substring(str, s, e) 
	return string.sub(str, s, e)
end

function strings.trim(str)
	return string.match(str, '^%s*(.-)%s*$')
end

function strings.at(str, i)
	return string.char(string.byte(str,i))
end

return strings
