
-- 格式化表
local function format_table(obj)
	outstr = {}
	local outlist = {}

	function _format_table(obj, level, is_sub_table)
		-- 避免循环输出  对象已输出则不在输出
		local obj_str = tostring(obj)
		for _, str in ipairs(outlist) do
			if str == obj_str then
				return
			end
		end

		table.insert(outlist, obj_str)

		level = level or 0
		local indent_str = ""
		for i = 1, level do
		  indent_str = indent_str.."    "
		end
	  
		if not is_sub_table then
			table.insert(outstr, indent_str .. "{")
		end
	  
		for k,v in pairs(obj) do
			if type(v) == "table" then 
				table.insert(outstr, string.format("%s    %s = {", indent_str, tostring(k)))
				_format_table(v, level + 1, true)
			elseif type(v) == "string" then
				table.insert(outstr, string.format('%s    %s = "%s",', indent_str, tostring(k), tostring(v)))
			else
				table.insert(outstr, string.format("%s    %s = %s,", indent_str, tostring(k), tostring(v)))
			end
		end

		if is_sub_table then
			table.insert(outstr, indent_str.."},")
		else
			table.insert(outstr, indent_str.."}")
		end
	end
	
	if type(obj) == "table" then
		_format_table(obj)
		outstr = table.concat(outstr, "\n")
	elseif type(obj) == "string" then
		outstr = '"' .. obj .. '"'
	else
		outstr = tostring(obj)
	end

	return outstr
end



local function _tostring(...)
	local count = select("#", ...)
	local outstr = ""
	for i=1, count,1 do
		if i == 1 then
			outstr = format_table((select(i, ...)))
		else
			outstr = outstr .. "\n" .. format_table((select(i, ...)))
		end
	end

	return outstr
end

local function log(...) 
	local info = debug.getinfo(2)
	local filepos = info.source .. ":" .. info.currentline
	local logstr = "\n位置:" .. filepos
	ngx.log(ngx.ERR, _tostring(logstr, ...) .. "\n")
end


return log
