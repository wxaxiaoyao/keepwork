local mysql = require("orm/mysql")
local mysql_query = require("orm/mysql_query")

local mysql_table = {}

function mysql_table:ctor()
	print('table:ctor()')
end

function mysql_table:new()
	print("table:new()")
	local obj = {}

	setmetatable(obj, self)
	self.__index = self
	
	obj.fields = {}

	return obj
end

-- 设置表名
function mysql_table:tablename(name)
	self.table_name = name
end

-- 添加表字段
function mysql_table:addfield(name, typ)
	self.fields[name] = {
		name=name,
		typ=typ,
	}
end

function mysql_table:getWhereStr(t)
	t = t or {}

	local sql_str = "";
	local has_where = false
	local is_first = true
	local is_or_first = true
	for key, value in pairs(t) do
		-- 非关键字
		if key[1] ~= "$" then
			if not has_where then
				sql_str = sql_str .. " where "
				has_where = true
			end
		
			if not is_first then
				sql_str = sql_str .. " and "
			end
			is_first = false

			sql_str = sql_str .. self:getValueStr(key, value)
		end
	end

	if t[mysql.OR] then
		if not has_where then
			sql_str = sql_str .. " where "
			has_where = true
		end
	
		if not is_first then
			sql_str = sql_str .. " and ("
		end

		for key, value in pairs(t[mysql.OR]) do
			if not is_or_first then
				sql_str = sql_str .. " or "
			end

			sql_str = sql_str .. self:getValueStr(key, value)
		end

		if not is_first then
			sql_str = sql_str .. ")"
		end
	end
	sql_str = sql_str .. " limit " .. tostring(t[mysql.LIMIT] or mysql.DEFAULT_LIMIT)  .. " "
	sql_str = sql_str .. " offset " .. tostring(t[mysql.OFFSET] or 0) .. " "

	return sql_str
end

function mysql_table:getValueStr(key, value)
	local expr = "="
	if type(value) == "object" then
		for k, v in pairs(value) do
			expr = k
			value = v
		end
	end

	if self.fields[key].typ == "string" then
		value = "`" .. tostring(value) .. "`"
	elseif self.fields[key].typ == "number" then
		value = tostring(value)
	end

	return key .. " " .. expr .. " " .. value
end

function mysql_table:find(t)
	local sql_str = "select * from " .. self.table_name .. " " .. self:getWhereStr(t)
	return sql_str
end

function mysql_table.insert(self, obj)
	local sql_str = "insert into " .. self.table_name .. "("
	local sql_value_str = "values("
	local first = true

	for key, value in pairs(obj or {}) do
		if first then
			sql_str = sql_str .. key
			sql_value_str = sql_value_str .. self:getValueStr(key, value)
		else
			sql_str = sql_str .. "," .. key
			sql_value_str = sql_value_str .. "," .. self:getValueStr(key, value)
		end

		first = false
	end

	sql_str = sql_str .. ") "
	sql_value_str = sql_value_str .. ")"
	sql_str = sql_str .. " " .. sql_value_str

	return sql_str
end


return mysql_table
