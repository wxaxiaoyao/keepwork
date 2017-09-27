
errors = {}

-- 错误信息定义
errors.SUCCESS = {id=0,message="success",}
errors.SERVER_INNER_ERROR = {id=1,message="server inner error",}
errors.PARAMS_ERROR = {id=2,message="params error",}
errors.NOT_FOUND = {id=3, message="not found",}
errors.USER_NOT_EXIST = {id=4, message="user not exist",}
errors.NOT_PRIVILEGES = {id=5, message="not privileges"}
errors.FORBIDDEN_ACCESS = {id=6, message="probidden access"}
errors.RECORD_ALREADY_EXIST = {id=7, message="record already exist"}


-- 设置日志打印器
--errors.log = console

function errors:setLog(func)
	self.log = func
end

-- 新建一个错误对象
function errors:new(message, data) 
	return {
		id=-1,
		message=message,
		data=data,
	};
end 

-- 判断是否正确
function errors:isOk(err) 
	return err.id == 0
end

-- 判断是否出错
function errors:isError(err)
	return err.id ~= 0
end

-- 报错错误信息 并打印log
function errors:wrap(err, data) 
	if not err then
		return {err=errors.SUCCESS, data=data}
	end
	
	if err and self.log and type(self.log) == "function" then 
		local info = debug.getinfo(2)
		self.log({
			err=err,
			data=data,
			filepos = info.source .. ":" .. info.currentline,
		})
	end

	if type(err) == "string" then 
		return {err=self:new(err),data=data,}
	elseif type(err) == "table" then
		return {err=err, data=data}
	end

	return {err=errors.SUCCESS, data=data}
end

