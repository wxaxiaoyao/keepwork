
local tabledb = {
	DEFAULT_LIMIT = 200,

	-- 关键字
	LIMIT = "$limit",	
	OFFSET = "$offset",
	OR = "$or",
	AND = "$and",
	ON = "$on",
}


local l_db = nil

function tabledb:init()
end

function tabledb:deinit()
end

function tabledb:new()
	local obj = {}

	setmetatable(obj, self)
	self.__index = self
	
	return obj
end

function tabledb:tablename(name)
	self.table_name = name
	self.table = l_db[name]
end


function tabledb:_get_query_object(t, is_pagination)
	t = t or {}

	local limit = t[tabledb.LIMIT] or tabledb.DEFAULT_LIMIT
	local offset = t[tabledb.OFFSET] or 0
	local key = ""
	local value = {}

	t["_id"] = nil
	t[tabledb.LIMIT] = nil
	t[tabledb.OFFSET] = nil

	for k, v pairs(t) do
		key = key .. "+" .. k
		value[#value+1] = v
	end

	if is_pagination then
		value["skip"] = offset
		value["limit"] = limit
	end

	return {[key]=value}
end

function tabledb:count(t)
	local query = self:_get_query_object(t)

	self.table:count(query, resume)
	local _, data = yield()

	return data or 0
end

function tabledb:find(t)
	local query = self:_get_query_object(t, true)

	self.table:find({[key]=value}, resume)
	local _, data = yield()
	--data = data or {}

	return data
end

function tabledb:find_one(t)
	t = t or {}
	t[tabledb.LIMIT] = 2
	
	local data = self:find(t)

	if data and #data == 1 then
		return data[1]
	end
	
	return nil
end

function tabledb:update(q, o)
	local query = self:_get_query_object(q)

	self.table:updateOne(query, o, resume)
	local _, data = yield()

	return data
end

function tabledb:delete(t)
	local query = self:_get_query_object(t)

	self.table:delete(query, resume)
	local _, data = yield()

	return data
end

function tabledb:insert(t)
	self.table:insertOne(t, resume)
	local _, data = yield()

	return data
end

function tabledb:upsert(q, t)
	local query = self:_get_query_object(q)

	self.table:insertOne(query, t, resume)
	local _, data = yield()

	return data
end
