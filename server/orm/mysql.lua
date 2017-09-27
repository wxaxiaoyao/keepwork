local luasql = require "luasql.mysql"

local mysql = {
	DEFAULT_LIMIT=200, -- 默认页大小

	-- 关键字
	LIMIT = "$limit",	
	OFFSET = "$offset",
	OR = "$or",
	AND = "$and",
	ON = "$on",
}

local function log(...)
	--print(...)
end

local l_log = nil
local l_is_inited = false
local l_env = luasql.mysql()
local l_conn = nil 

function mysql:setLog(log)
	l_log = log
end

function mysql:init(config)
	if l_is_inited then
		return
	end

	config = config or {}
	config.database = config.database or "keepwork"
	config.username = config.username or "wuxiangan"
	config.password = config.password or "wuxiangan"
	config.host = config.host or "127.0.0.1"
	config.port = config.port or 3306

	l_log = config.log or log
	l_conn = l_env:connect(config.database, config.username, config.password, config.host, config.port)
	l_conn:execute("SET NAMES UTF8")
	l_is_inited = true
end


function mysql:deinit()
	if l_is_inited then
		l_conn:close()
		l_env:close()
	end
end


function mysql:execute(sql_str)
	return l_conn:execute(sql_str)
end


function mysql:ctor()
	--print('table:ctor()')
end

function mysql:new()
	--print("table:new()")
	local obj = {}

	setmetatable(obj, self)
	self.__index = self
	
	return obj
end

-- 设置表名
function mysql:tablename(name)
	if not name then
		return self.table_name
	end


	self.table_name = name

	return self.table_name
end

function mysql:get_where_str(t)
	t = t or {}

	local sql_str = "";
	local has_where = false
	local is_first = true
	local is_or_first = true
	for key, value in pairs(t) do
		-- 非关键字
		local pos = string.find(key, "%$")
		if pos ~= 1 then
			if not has_where then
				sql_str = sql_str .. " where "
				has_where = true
			end
		
			if not is_first then
				sql_str = sql_str .. " and "
			end
			is_first = false

			sql_str = sql_str .. self:get_key_value_str(key, value)
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

			sql_str = sql_str .. self:get_key_value_str(key, value)
		end

		if not is_first then
			sql_str = sql_str .. ")"
		end
	end
	if t[mysql.LIMIT] then
		sql_str = sql_str .. " limit " .. tostring(t[mysql.LIMIT] or mysql.DEFAULT_LIMIT)  .. " "
	end

	if t[mysql.OFFSET] then
		sql_str = sql_str .. " offset " .. tostring(t[mysql.OFFSET] or 0) .. " "
	end
	return sql_str
end

function mysql:get_key_value_str(key, value)
	local expr = "="
	if type(value) == "object" then
		for k, v in pairs(value) do
			expr = k
			value = v
		end
	end

	if type(value) == "string" then
		value = "'" .. tostring(value) .. "'"
	elseif type(value) == "number" then
		value = tostring(value)
	end

	return "`".. key .. "`" .. " " .. expr .. " " .. value, value, expr
end

-- 查找记录
function mysql:find(t)
	local sql_str = "select * from `" .. self.table_name .. "` " .. self:get_where_str(t)
	
	l_log(sql_str)

	local list = {}
	local row = {}
	local cur, err = mysql:execute(sql_str)
	if not cur then
		return cur, err
	end
	
	row = cur:fetch({}, "a") 
	while row do
		list[#list+1] = row
		--l_log(row.username)
		row = cur:fetch({}, "a") 
	end
	 
	return list
end

-- 查找单条记录
function mysql:find_one(t)
	t = t or {}
	t[mysql.LIMIT] = 2

	local list, err = self:find(t)
	if not list then
		return list, err
	end

	if #list == 1 then
		return list[1]
	end

	return nil, "record count error!!!"
end

-- 插入记录
function mysql:insert(obj)
	local sql_str = "insert into `" .. self.table_name .. "`("
	local sql_value_str = "values("
	local first = true

	for key, value in pairs(obj or {}) do
		local _, v = self:get_key_value_str(key, value)
		if first then
			sql_str = sql_str .. "`" .. key .. "`"
			sql_value_str = sql_value_str .. v
		else
			sql_str = sql_str .. "," .. "`" .. key .. "`"
			sql_value_str = sql_value_str .. "," .. v
		end

		first = false
	end

	sql_str = sql_str .. ") "
	sql_value_str = sql_value_str .. ")"
	sql_str = sql_str .. " " .. sql_value_str

	l_log(sql_str)
	return mysql:execute(sql_str)
	--return sql_str
end

-- 更新记录
function mysql:update(q, o)
	local sql_str = "update `" .. self.table_name .. "` set "	
	local first = true

	for key, value in pairs(o or {}) do
		local _, v = self:get_key_value_str(key, value)
		if first then
			sql_str = sql_str .. "`" .. key .. "`" .. "=" .. v 
		else
			sql_str = sql_str .. ", " .. "`"  .. key .. "`" .. "=" .. v
		end
		first = false
	end

	sql_str = sql_str .. " " .. self:get_where_str(q)
	
	l_log(sql_str)
	return mysql:execute(sql_str)
	--return sql_str
end

-- 删除记录
function mysql:delete(q)
	local sql_str = "delete from `" .. self.table_name .. "` "

	sql_str = sql_str .. self:get_where_str(q)

	l_log(sql_str)

	return mysql:execute(sql_str)
end

-- 增改记录
function mysql:upsert(q, o)
	if self:findOne(q) then
		return self:update(q,o)
	end

	return self:insert(o)
end

return mysql
