
local errors = {}

-- 错误信息定义
errors.SUCCESS = {id=0,message="success",}
errors.SERVER_INNER_ERROR = {id=1,message="server inner error",}
errors.PARAMS_ERROR = {id=2,message="params error",}
errors.NOT_FOUND = {id=3, message="not found",}
errors.USER_NOT_EXIST = {id=4, message="user not exist",}
errors.NOT_PRIVILEGES = {id=5, message="not privileges"}
errors.FORBIDDEN_ACCESS = {id=6, message="probidden access"}
errors.RECORD_ALREADY_EXIST = {id=7, message="record already exist"}
errors.DB_ERROR = {id=8, message = "database error"}


-- 设置日志打印器
--errors.log = console

function errors:set_log(func)
	self.log = func
end

-- 新建一个错误对象
function errors:new(message, data) 
	local obj = {
		id=-1,
		message=message,
		data=data,
	}

	--setmetatable(obj, self)
	--self.__index = self

	return obj
end 

-- 判断是否正确
function errors:is_ok() 
	return self.id == 0
end

-- 判断是否出错
function errors:is_error()
	return self.id ~= 0
end

-- 报错错误信息 并打印log
function errors:wrap(err, data) 
	local result = nil
	if not err then
		result = {error=errors.SUCCESS, data=data}
	end
	
	if err and self.log and type(self.log) == "function" then 
		local info = debug.getinfo(2)
		self.log({
			error=err,
			data=data,
			filepos = info.source .. ":" .. info.currentline,
		})
	end

	if type(err) == "string" then 
		result = {error=self:new(err),data=data}
	elseif type(err) == "table" then
		result = {error=err, data=data}
	end

	setmetatable(result, self)
	self.__index = self

	return result
end

return errors
