
require("error")

commonlib = {}

-- get a table f, where f is a string
-- @param f: f is a string like "a.b.c.d"
-- @param rootEnv: it can be a table from which to search for f, if nil, the global table _G is used.
function commonlib.gettable(f, rootEnv)
    if(not f) then return end 
    local t = rootEnv or _G    -- start with the table of globals
    for w, d in string.gfind(f, "([%w_]+)(.?)") do
        t[w] = t[w] or {}   -- create table if absent
        t = t[w]            -- get the table
    end 
    return t;
end

-- 对象继承
function commonlib.inherit(base, derived)
	derived = derived or {}
	
	derived.new = function(self)
		-- 创建子类
		base = base or {}

		if type(base.new) == "function" then
			base = base.new(base)
		end
	
		local obj = {}
		setmetatable(obj, derived)
		derived.__index = derived

		setmetatable(derived, base)
		base.__index = base

		-- 调用子类构造函数
		if type(base.ctor) == "function" then
			base:ctor()
		end

		-- 调用派生类构造函数
		if type(obj.ctor) == "function" then
			obj:ctor()
		end

		return obj
	end
	return derived
end

-- 对象导出
function commonlib.export(obj, list)
	return setmetatable({}, {
		__index = function(t,k)
			for _, key in ipairs(list or {}) do
				if key == k then
					local value = obj[key]
					if value and type(value) == "function" then
						return function(params)
							value(obj, params)
						end
					end
					return value
				end
			end
		end
	})
end

-- 控制台输出
function commonlib.console(msg)
	if type(msg) == "table" then
		for key , value in pairs(msg) do
			print(key .. ":" .. tostring(value))
		end
	else
		print(msg)
	end
end

function string_split(str, sep)
	local list = {}

	for word in string.gmatch(str, sep .. '?([^' .. sep .. ']*)') do
		if word ~= "" then
			list[#list+1] = word
		end
	end

	return list
end

function merge_table(t1, t2)
	local t = {}

	for key, value in pairs(t1 or {}) do
		t[key] = value
	end

	for key, value in pairs(t2 or {}) do
		t[key] = value
	end

	return t
end

function getCurrentDir(dept)
	dept = dept or 0

	local info = debug.getinfo(dept)

	return string.match(info.source, '@(.*)/[^/]*$')
end


function test()
	console(debug.getinfo(2))
end

--return commonlib
