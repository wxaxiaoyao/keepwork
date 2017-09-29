
local mysql = require("orm/mysql")

local orm = {}

orm.DB_TYPE_MYSQL=0
orm.DB_TYPE_TABLEDB=1


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

	obj._db_type = orm.DB_TYPE_MYSQL
	obj._db = mysql:new()
	--self.set_db_type(obj, orm.DB_TYPE_MYSQL)

	return obj
end

function orm:ctor()
end

function orm:init(t)
	self._db:init(t)
end

function orm:deinit()
	self._db:deinit()
end

function orm:tablename(t)
	self._db:tablename(t)
end

function orm:set_db_type(typ)
	self._db_type = typ

	if self._db_type ==  self.DB_TYPE_MYSQL then
		self._db = mysql:new()
	end
end

function orm:find_one(t)
	return self._db:find_one(t)
end

function orm:find(t) 
	return self._db:find(t)
end

function orm:upsert(q, t)
	return self._db:upsert(q, t)
end

function orm:insert(t)
	return self._db:insert(t)
end

function orm:delete(t) 
	return self._db:delete(t)
end

function orm:update(q, t)
	return self._db:update(q, t)
end

function orm:execute(t)
	return self._db:execute(t)
end

function orm:db()
	return self._db
end

--mysql:set_log(commonlib.console)
--orm:init()
mysql:init()

return orm

