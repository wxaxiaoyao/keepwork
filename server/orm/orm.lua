
local mysql = require("orm/mysql")

local orm = {}

orm.DB_TYPE_MYSQL=0
orm.DB_TYPE_TABLEDB=1

local l_db_type = orm.DB_TYPE_MYSQL
local l_db = mysql:new()

function orm:new()
	local obj = {}

	setmetatable(obj, self)
	self.__index = function(t, k)
		local mt = getmetatable(t)
		local pos = string.find(k, '_')
		if pos == 1 then
			return nil
		end
		
		return mt[k]
	end

	--self.set_db_type(obj, orm.DB_TYPE_MYSQL)

	return obj
end

function orm:ctor()
end

function orm:init(t)
	l_db:init(t)
end

function orm:deinit()
	l_db:deinit()
end

function orm:tablename(t)
	l_db:tablename(t)
end

function orm:set_db_type(typ)
	l_db_type = typ

	if l_db_type ==  self.DB_TYPE_MYSQL then
		l_db = mysql:new()
	end
end

function orm:find_one(t)
	return l_db:find_one(t)
end

function orm:find(t) 
	return l_db:find(t)
end

function orm:upsert(q, t)
	return l_db:upsert(q, t)
end

function orm:insert(t)
	return l_db:insert(t)
end

function orm:delete(t) 
	return l_db:delete(t)
end

function orm:update(q, t)
	return l_db:update(q, t)
end

function orm:execute(t)
	return l_db:execute(t)
end

function orm:db()
	return l_db
end

orm:init()

return orm

