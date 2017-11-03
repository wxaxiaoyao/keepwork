
local errors = {}



-- 设置日志打印器
--errors.log = console

function errors:set_log(func)
	self.log = func
end

-- 新建一个错误对象
function errors:new(obj) 
	obj = obj or { id = -1, message = "unknow error" }

	if type(obj) ~= "table" then 
		obj = {id = -1, message = obj}
	end

	setmetatable(obj, self)
	self.__index = self

	return obj
end 

-- 判断是否正确
function errors:is_ok() 
	return self.id == 0
end

-- 判断是否出错
function errors:is_error()
	self.log(self.id)
	return self.id ~= 0
end

-- 报错错误信息 并打印log
function errors:wrap(err, data) 
	if err and self.log then 
		local info = debug.getinfo(2)
		self.log({
			error=err,
			data=data,
			filepos = info.source .. ":" .. info.currentline,
		})
	end

	err = err or errors.SUCCESS

	if type(err) ~= "table" then 
		err = errors:new({id=-1, message=err, data=data})
	else
		err.data = data
	end

	return err
end

-- 错误信息定义
errors.SUCCESS = errors:new({id=0,message="success"})
errors.SERVER_INNER_ERROR = errors:new({id=1,message="server inner error"})
errors.PARAMS_ERROR = errors:new({id=2,message="params error"})
errors.NOT_FOUND = errors:new({id=3, message="not found"})
errors.USER_NOT_EXIST = errors:new({id=4, message="user not exist"})
errors.NOT_PRIVILEGES = errors:new({id=5, message="not privileges"})
errors.FORBIDDEN_ACCESS = errors:new({id=6, message="probidden access"})
errors.RECORD_ALREADY_EXIST = errors:new({id=7, message="record already exist"})
errors.DB_ERROR = errors:new({id=8, message = "database error"})

return errors
