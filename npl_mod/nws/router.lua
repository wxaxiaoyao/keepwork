--require("helper")
function string_split(str, sep)
end

function file_exist(filename)
	local file = io.open(filename, "rb")
	if file then
		file:close()
	end

	return file ~= nil
end

local router = commonlib.gettable("nws.router")

router.regexp_handler = {}
router.normal_handler = {}
router.controller_path = "controllers/"

local method_list = {
	get = "get",
	post = "post",
	delete = "delete",
	put = "put",
	head = "head",
	patch = "patch",
	options = "options",
}

local function parse_path(path)
	-- 是否正则path 正则串  路径参数名列表
	local regexp_handler = self.regexp_handler
	local normal_handler = self.normal_handler
	local number = '[%d]+'
	local string = '[%w]+'
	local none = '[%d%w]+'
	local regpath = "/"
	local argslist = {}
	local argscount = 1
	local isregpath = false
	for word in string.gmatch(path, '([^/]+)') do
		local argname = string.match(word, '(:[%w]+)')
		local regstr = string.match(word, '(%(.*%))')
		word = string.gsub(word, argname, "")
		word = string.gsub(word, '(%(.*%))', regstr or none)
		argslist[argscount] = argname
		argscount = argscount + 1
		
		if argname or regstr then
			isregpath = true
		end

		regpath = regpath .. '/' .. word 
	end
	return false, regstr, argslist
end

local function get_controller(ctrl_name)
	if not ctrl_name or ctrl_name == "" then
		return nil
	end

	local ctrl = nil
	pcall(function(module_name)
		ctrl = require(module_name)
	end, 'controllers.' .. ctrl_name)

	return ctrl
end

-- path: url路劲
-- controller: table|function
-- handle: string 处理方式
function router:router(path, controller, handles)
	local is_reg, regstr, argslist = parse_path(path)

	local regexp_handler = self.regexp_handler
	local normal_handler = self.normal_handler

	local h = {
		regstr = regstr,
		path = path,
		argslist = argslist,
		controller = controller,
		handle = handle,
	}

	handles = handles or "all:"
	for handle in string.gmatch(handles, '([^,]+)') do
		method, funcname = string.match(handle, "(.*):(.*)")
		if not method or method == "" then
			method = method_list[string.lower(handle)] or "all"
			funcname = handle
		end

		if not funcname or funcname == "" then
			funcname = method
		end

		h[method] = funcname
	end

	if is_reg then
		regexp_handler[#regexp_handler+1] = h
	else
		normal_handler[path] = h
	end

	return self
end

function router:handle(path, ctx)
	local normal_handle = self.normal_handler[path]
	--local regexp_handler = self.regexp_handler
	local method = string.lower(ctx.request.method)
	local paths = {}
	local url_params = {}

	-- 普通完整匹配
	local funcname = normal_handle[method] or normal_handle["all"]
	local controller = normal_handle.controller
	if funcname then
		if type(controller)	== "function" then
			return controller(ctx)
		elseif type(controller) == "table" and controller[funcname] then
			return (controller[funcname])(controller, ctx)
		else
			--error("controller type error")
		end
	end

	-- 控制器自动匹配
	for word in string.gmatch(path, '([^/]+)') do
		paths[#paths+1] = word
		if #paths > 2 then
			url_params[#url_params+1] = word
		end
	end
	
	ctx.request.url_params = url_params
	controller = get_controller(paths[1]) 
	funcname = paths[2] or method
	if type(controllerj) == "table" and controller[funcname] then
		return (controller[funcname])(controller, ctx)
	end

	-- 正则路由
end


--function router:new()
	--local obj = {}

	--setmetatable(obj, self)
	--self.__index = self
	
	--return obj
--end

----path 为路径
----handle 为处理链
--function router:path(path, handle)
	--local h = nil

	--if type(handle) == "function" then
		--h = {handle}
	--elseif type(handle) ~= "object" then
		--h = {function() return handle end}
	--else
		--h = handle
	--end

	--self.handler.pathHandler[path] = h
--end

--function router:terminal()
	--self.is_terminal = true
--end

--function router:group(path, handle)

--end

--function router:controller(path, handle)
	
--end


--function router:filemap(path, dir, is_api, before, after) 
	--local handle = function(req, resp)
		--local uri = req.uri
		--local pos = string.find(uri, path)
		--if 1 ~= pos then
			--return false
		--end
		
		--local filename, funcname = string.match(uri, '^' .. path .. '/([^/]*)/(.*)')
		--if not filename or not funcname then
			--return false
		--end

		--filename = dir .. '/' .. filename
		--funcname = string.gsub(funcname, '/','_')
		---- 文件不存在
		--if not file_exist(filename .. '.lua') then
			--ngx_log("file not exist:" .. filename)
			--return false
		--end
		---- 加载模块
		--local module = require(filename)
		--local func = module[funcname]
		--if not func or type(func) ~= "function" then
			--ngx_log("request url nox exist")
			--return false
		--end
		
		--if is_api then
			--local params = req:get_params()
			--local result = func(module, params, req, resp)
			--local data = result.data 
			
			--if result.data  then
				--result.data = nil
			--end

			--resp:send({error = result, data = data})
		--else
			--return func(module, req, resp)
		--end
	--end

	--local handles = {}
	--for _, h in ipairs(before or {}) do
		--if type(h) == "function" then
			--handles[#handles+1] = h
		--end
	--end

	--handles[#handles+1] = handle

	--for _, h in ipairs(after or {}) do
		--if type(h) == "function" then
			--handles[#handles+1] = h
		--end
	--end

	--self.handler.fileHandler[path] = handles
--end

---- 默认处理程序
--function router:setDefaultHandle(handle)
	--self.defaultHandle = handle
--end

---- 获取处理程序
--function router:getHandle(path)
	---- 优先路径匹配
	--local handle = self.handler.pathHandler[path]
	
	--if handle then 
		--return handle
	--end

	---- 组匹配
	--for key, value in pairs(self.handler.groupHandler) do
		--local pos = string.find(path, key)
		--if pos == 1 then 
			--return value
		--end
	--end

	---- 文件匹配
	--for key, value in pairs(self.handler.fileHandler) do
		--local pos = string.find(path, key)
		--if pos == 1 then 
			--return value
		--end
	--end

	--return {self.defaultHandle}
--end

---- 处理请求
--function router:handle(req, resp)
	--local handle = self:getHandle(req.uri)

	--for _, func in ipairs(handle or {}) do
		--func(req, resp)

		--if not self.is_terminal then
			--break
		--end
	--end
--end

return router
