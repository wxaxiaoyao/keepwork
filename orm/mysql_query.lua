
local mysql_query = {}

function mysql_query:new(q)
	local obj = {}
	setmetatable(obj, self)
	self.__index = self

	q = q or {}

	obj.m_select = q.select or {"*"}
	obj.m_tablename = q.m_tablename
	obj.m_from = q.from or {}
	obj.m_where = q.where or {}
	obj.m_limit = q.limit or 200
	obj.m_skip = q.skip or 0


	return obj
end

-- 不重复
function mysql_query:distinct()
	self.m_distinct = true
	return self
end

-- 选择列
-- {"*"}
-- {"field1","field2"}
function mysql_query:select(t)
	self.m_select=t
	return self
end

-- 设置表名
function mysql_query:tablename(s)
	self.m_select = s
end

-- 连接
-- {连接方式, 表名, 别名, on=连接条件}
-- {"inner join", "user", "u", on="u.id=t.id"}
function mysql_query:join(t)
	self.m_from[#self.m_from+1] = t
	return self
end

-- and where 条件
function mysql_query:where(t)
	self.m_where[#self.m_where+1] = t 
	return self
end

-- or where 条件
function mysql_query:orWhere(t)
	self.m_where["or"] = t
	return self
end

function mysql_query:string()
	local query_str = "select "

	if self.m_distinct then
		query_str = query_str .. "distinct "
	end

	for index, field in ipairs(self.m_select) do
		if index == 1 then
			query_str = query_str .. field .. " "
		else
			query_str = query_str .. "," .. field .. " "	
		end
	end
	
	query_str = query_str .. "from " .. self.m_tablename .. " "
	
	for index, table in ipairs(self.m_from) do
		for _, value in ipairs(table) do
			query_str = query_str .. value .. " "
		end
		if value["on"] then
			query_str = query_str .. "on " .. value["on"] .. " "
		end
	end

	query_str = query_str .. "where "
	for index, where in ipairs(self.m_where) do
		if #where == 2 then
			query_str = query_str .. where[1] .. "=" .. where[2] .. " "
		else
			for _, value in ipairs(where) do
				query_str = query_str .. value .. " "
			end
		end
	end

	query_str = query_str .. "limit " .. tostring(self.m_limit) .. " offset " .. tostring(self.m_skip) .. " "

	return query_str
end






