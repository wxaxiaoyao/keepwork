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

local route = {}

function route:new()
	return {
		next_map = {},  -- 子路径映射
	}
end

function route:get_by_paths(root, paths)
	root = root or root:new()
	for _, path in ipairs(paths or {}) do
		root.next_map[path] = root.next_map[path] or route:new()
		root = root.next_map[path]
	end

	return root
end

local router = commonlib.gettable("nws.router")


router.regexp_handler = {}
router.normal_handler = {}
router.controller_handler = {}
router.tree_handler = route:new()
router.controller_path = "controllers/"

local method_list = {
	get = "get",
	post = "post",
	delete = "delete",
	put = "put",
	head = "head",
	patch = "patch",
	options = "options",
	any = "any",
}

function router:parse_path(path)
	-- 是否正则path 正则串  路径参数名列表
	local int = '([%%d]+)'
	local number = '([%%d.]+)'
	local string = '([%%w]+)'
	local none = '([%%d%%w]+)'
	local regpath = ""
	local argslist = {}
	local argscount = 1
	local isregpath = false
	local paths = {}
	for word in string.gmatch(path, '([^/]+)') do
		local argname = string.match(word, '(:[%w]+)')
		local regstr = string.match(word, '(%(.*%))')
		--print(argname, regstr)
		paths[#paths+1] = word
		if argname or regstr then
			if argname and not regstr then
				word = string.gsub(word, argname, none)
			elseif argname and regstr then
				word = string.gsub(word, argname, "")
			end
			word = string.gsub(word, '(%(int%))', int)
			word = string.gsub(word, '(%(number%))', number)
			word = string.gsub(word, '(%(string%))', string)
			argslist[argscount] = argname or argscount
			argscount = argscount + 1
			isregpath = true
		end
		regpath = regpath .. '/' .. word 
	end
	regpath = '^' ..regpath .. '$'
	return isregpath, regpath, paths, argslist
end

function router:get_controller(ctrl_name)
	if not ctrl_name or ctrl_name == "" then
		return nil
	end

	local ctrl = nil
	pcall(function(module_name)
		ctrl = require(module_name)
	end, 'controllers.' .. ctrl_name)

	return ctrl
end

function router:get_handle(is_reg, path)
	local handler = nil

	if is_reg then
		handler = self.regexp_handler
	else
		handler = self.normal_handler
	end

	handler[path] = handler[path] or {}

	return handler[path]
end
-- path: url路劲
-- controller: table|function
-- handle: string 处理方式
function router:router(path, controller, handles)
	local is_reg, regstr, paths, argslist = self:parse_path(path)

	local regexp_handler = self.regexp_handler
	local normal_handler = self.normal_handler
	local handle = self:get_handle(is_reg, path)
	local route_handle = nil

	handle.regstr = regstr
	handle.path = path
	handle.argslist = argslist
	handle.controller = controller
	handle.handle = handle
	handle.paths = paths

	for handle_str in string.gmatch(handles or "any", '([^,]+)') do
		method, funcname = string.match(handle_str, "(.*):(.*)")
		if not method or method == "" then
			method = method_list[string.lower(handle_str)] or "any"
			funcname = handle_str
		end

		if not funcname or funcname == "" then
			funcname = method
		end

		handle[method] = funcname
	end

	-- 注册控制器路由
	if type(controller) == "table" and handles == nil then
		self.controller_handler[path] = handle
		route_handle = route:get_by_paths(self.tree_handler, paths)
		route_handle.handle = handle
	end

	return self
end

function router:handle(path, ctx)
	local normal_handler = self.normal_handler
	local regexp_handler = self.regexp_handler
	local tree_handler = self.tree_handler
	local method = string.lower(ctx.request.method)
	local paths = {}
	local url_params = {}
	local funcname = nil
	local controller = nil
	local handle = nil
	local route_handle = nil

	-- 处理回调执行
	local handle_func = function(handle, ctx)
		local funcname = handle[method] or handle["any"]
		local controller = handle.controller
		if funcname then
			if type(controller)	== "function" then
				return controller(ctx)
			elseif type(controller) == "table" and controller[funcname] then
				return (controller[funcname])(controller, ctx)
			else
				--error("controller type error")
			end
		end
	end
	
	-- 普通完整匹配
	handle = normal_handler[path]
	if handle then
		return handle_func(handle, ctx)
	end
	
	-- 控制器路径匹配
	handle = self.controller_handler[(string.gsub(path, '/[%w%d]+$', '')) or ""]
	if handle then
		funcname = string.match(path,'/([%w%d]+)$')
		controller = handle.controller
		if controller[funcname] then
			return (controller[funcname])(controller, ctx)
		end
	end

	url_params = {}
	handle = nil
	for word in string.gmatch(path, '([^/]+)') do
		paths[#paths+1] = word
	end

	route_handle = tree_handler
	--commonlib.console(route_handle)
	for _, x in ipairs(paths) do
		url_params[#url_params+1] = x
		if route_handle then
			route_handle = route_handle.next_map[x]
			if route_handle and route_handle.handle then
				handle = route_handle.handle
				url_params = {}
			end
		end
	end
	if handle then
		controller = handle.controller
		funcname = url_params[1] or method
		if controller[funcname] then
			table.remove(url_params, 1)
			ctx.request.url_params = url_params
			return (controller[funcname])(controller, ctx)
		end
	end

	url_params = {}
	for word in string.gmatch(path, '([^/]+)') do
		url_params[#url_params+1] = word
	end
	-- 控制器自动匹配
	ctx.request.url_params = url_params
	controller = self:get_controller(url_params[1]) 
	funcname = url_params[2] or method
	if type(controllerj) == "table" and controller[funcname] then
		table.remove(url_params,1)
		table.remove(url_params,1)
		ctx.request.url_params = url_params
		return (controller[funcname])(controller, ctx)
	end

	-- 正则路由
	for _, handle in pairs(regexp_handler) do
		url_params = {string.match(path, handle.regstr)}
		if #url_params > 0 then
			for i, v in ipairs(handle.argslist) do
				url_params[v] = url_params[i] 
			end
			ctx.request.url_params = url_params
			
			--ctx.handle = handle
			return handle_func(handle, ctx)
		end
	end

	print("no router match")
	return nil
end

return router
