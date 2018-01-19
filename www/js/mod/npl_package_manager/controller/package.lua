
NPL.load("(gl)script/ide/Files.lua")

local g_lfs = commonlib.Files.GetLuaFileSystem()
local wikimod_name = "npl_package_manager"
local wikimod_path = nws.config.wikimod_path .. wikimod_name .. "/"
local model_path = wikimod_path .. "model/"

-- 获取控制器类
local controller = nws.gettable("nws.controller")
local package = controller:new("package")

local package_model = nws.import(model_path .. "package")

-- 编写test方法
function package:get(ctx)
	return errors:wrap(nil, "this is a test")
end

-- 文件是否存在
local function file_is_exist(path)
	return (g_lfs.attributes(path))
end

-- 写文件
local function write_file(filename, content)
	local dirname = string.match(filename, "[^/]+$", "")
	if not file_is_exist(dirname) then
		ParaIO.CreateDirectory(dirname)
	end

	local f = ParaIO.open(filename, "w")
	if not f:IsValid() then
		return false
	end

	f:WriteString(content, #content)
	
	f:close()

	return true
end

local function delete_file(filename) 
	ParaIO.DeleteFile(filename)
end

-- 获取包配置通过包数据
local function get_package_config_by_package_file(filename) 
	local dirname = string.match(filename, "[^/]+$", "")
	if(ParaAsset.OpenArchive(filename, true)) then
		local filesOut = {};
		commonlib.Files.Find(filesOut, "", 0, 10000, ":^[^/]*/?package.npl$", filename);
		if #filesOut == 0 then
			ParaAsset.CloseArchive(filename);
			return false
		end
		--log(filesOut)
		local item = filesOut[1]
		for _, x in ipairs(filesOut) do
			if #x.filename < #item.filename then
				item = x
			end
		end

		local file = ParaIO.open(dirname .. item.filename, "r")
		if(file:IsValid()) then
			local content = file:GetText();
			file:close();
			ParaAsset.CloseArchive(filename);
			return true, content
		end
		ParaAsset.CloseArchive(filename);
	end

	return false
end

function package:upload(ctx)
	local params = ctx.request:get_params()

	if not params.username or not params.name or not params.version or not params.content then
		params.content = nil
		nws.log(params)
		return (errors:wrap(errors.PARAMS_ERROR, params))
	end

	local data = package_model:get_by_name_version(params)

	if data and data.username ~= params.username then
		return (errors:wrap("包已存在"))
	end
	
	local filename = wikimod_path .. "zip/" .. params.name .. "/" .. params.version .. ".zip"
	if not write_file(filename, params.content) then
		return errors:wrap("写文件出错")
	end

	local ok,package_config_content = get_package_config_by_package_file(filename)
	local package_config = NPL.LoadTableFromString(package_config_content or "{}")
	if not ok or not package_config then
		return (errors:wrap("解析包配置错误"))
	end
	
	if not package_config.name or not package_config.version or 
		params.name ~= package_config.name or params.version ~= package_config.version then
		delete_file(filename)
		return (errors:wrap("参数和包配置信息不匹配"))
	end

	params.content = nil
	params.config = package_config_content
	params.filename = filename

	local err = package_model:set(params)
	
	return (errors:wrap(err))
end

function package:get_by_name(ctx)

end

function package:get_by_name_version(ctx)

end

return package
