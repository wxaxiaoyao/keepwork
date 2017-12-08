require("basetype")

local mdconf = {}

local function confConvert(c) 
	if type(c) ~= "table" then
		return c
	end

	local nc = {}

	if c.length then
		for i = 0, c.length - 1  do
			nc[#nc+1] = confConvert(c[tostring(i)])
		end
	else 
		for key, value in pairs(c) do
			nc[key] = confConvert(c[key])
		end
	end

	return nc
end

-- md 转json对象
mdconf.mdToJson = function(text) 
	local temp_lines = text.trim().split("\n")
	local lines = {}
	local line = ""
	local conf = {}
	local curConf = conf

	local getObj = function(key) 
		if not key or key == "" then
			return conf
		end
		local keys = key.split(".")
		local tmpConf = conf
		for i, v in ipairs(keys) do
			tmpConf[v] = tmpConf[v] or {}

			local vn = tonumber(v)
			if vn then
				tmpConf.length = tmpConf.length or -1
				if tmpConf.length <= vn then
					tmpConf.length = vn + 1
				end
			end
			tmpConf = tmpConf[v]
		end

		return tmpConf
	end


	local _mdToJson = function(line) 
		local flag, content = line.match('^([-+#]) (.*)')
		local key, value, temp

		content = content.trim()
		if flag == "#" then
			curConf = getObj(content)
		end

		if flag == "+" or flag == "-"  then
			temp = content.indexOf(":")
			if (temp and temp > 1) then
				key = content.substring(0, temp - 1).trim() 
				value = content.substring(temp + 1).trim()
			else 
				curConf.length = curConf.length or 0
				key = tostring(curConf.length)
				value = content.trim()
				curConf.length = curConf.length + 1
			end

			if value == "true" then
				value = true
			elseif value == "false" then
				value = false
			else 
				value = value
			end

			curConf[key] = value
		end
	end

	local is_comment = false
	for i, l in ipairs(temp_lines) do
		if l.match('^<!--.*-->%s*$') then
		elseif l.match('^<!--') then
			is_comment = true
		elseif is_comment then
			if l.match('-->%s*$') then
				is_comment = false
			end
		elseif not l.match('^[-+#] .*') then
			line = line .. l  .. "\n"
		else
			if line and line ~= "" then
				lines[#lines+1] = line
			end
			line = l
		end
	end

	if line and line ~= "" then
		lines[#lines+1] = line
	end

	if #lines == 1 and not lines[1].match('^[-+#] .*') then
		return lines[1].trim()
	 else 
		for _, line in ipairs(lines) do 
			_mdToJson(line.trim())
		end
	end
	
	return confConvert(conf)
end

local function _jsonToMd(obj, key_prefix) 
	local text = ""
	if key_prefix and key_prefix ~= "" then
		key_prefix = key_prefix .. "."
	else 
		key_prefix = ""
	end
	if #obj == 0 then
		-- 单对象对应列表
		for key, value in pairs(obj) do 
			-- 优先写非对象值
			if key.indexOf("$$") ~= 0 and type(value) ~= "table" then
				text = text .. "- " .. key .. " : " .. value .. "\n"
			end
		end
		for key, value in pairs(obj) do 
			-- 写对象值
			if key.indexOf("$$") ~= 0 and type(value) == "table" then
				text = text .. "\n# " .. key_prefix .. key .. "\n"
				text = text .. _jsonToMd(value, key_prefix .. key)
			end
		end
	 else 
		for i, value in ipairs(obj) do
			if type(value) ~= "table" then
				text = text .. "- " .. obj[i] .. "\n"
			else
				text = text .. "\n# " .. key_prefix .. (i-1) .. "\n"
				text = text .. _jsonToMd(value, key_prefix .. (i-1))

			end 
		end
	end

	return text
end

-- json对象转markdown文本
mdconf.jsonToMd = function(obj) 
	-- 非对象直接写入
	if type(obj) ~= "table" then
		return obj
	end
	

	return _jsonToMd(obj)
end

mdconf.test = function() 
	local obj, text
	obj = "hello world"
	text = mdconf.jsonToMd(obj)
	console(text)
	--console(angular.toJson(mdconf.mdToJson(text)))
	console(mdconf.mdToJson(text))

	obj = {key="value"}
	text = mdconf.jsonToMd(obj)
	console(text)
	--console(angular.toJson(mdconf.mdToJson(text)))
	console(mdconf.mdToJson(text))

	obj = {"list1", "list2"}
	text = mdconf.jsonToMd(obj)
	console(text)
	--console(angular.toJson(mdconf.mdToJson(text)))
	console(mdconf.mdToJson(text))

	obj = {{"list1", "list2"}, {"list3", "list4"}}
	text = mdconf.jsonToMd(obj)
	console(text)
	--console(angular.toJson(mdconf.mdToJson(text)))
	console(mdconf.mdToJson(text))

	obj = {key="value", list={"list1", "list2"}}
	text = mdconf.jsonToMd(obj)
	console(text)
	--console(angular.toJson(mdconf.mdToJson(text)))
	console(mdconf.mdToJson(text))

	obj = {key="value", list={{key1="value1"},{key2="value2"}}}
	text = mdconf.jsonToMd(obj)
	console(text)
	--console(angular.toJson(mdconf.mdToJson(text)))
	console(mdconf.mdToJson(text))

	obj = {key="value", list={{key1="value1"},{key2="value2", list={"list1"}}}}
	text = mdconf.jsonToMd(obj)
	console(text)
	--console(angular.toJson(mdconf.mdToJson(text)))
	obj = mdconf.mdToJson(text)
	console(obj)
end

--mdconf.test()

return mdconf
