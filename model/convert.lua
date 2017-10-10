-- title. data source
-- author. xiaoyao
-- date. 2017-9-28

local convert = {}

function convert.list_convert(list, func)
	local result = {}
	for _, obj in ipairs(list or {}) do
		result[#result+1] = func(obj)
	end

	return result
end

-- 用户信息转换
function convert.user_old_to_new(obj)
	return {
		user_id = obj._id,
		username = obj.username,
		nickname = obj.displayName,
		password = obj.password,
		email = obj.email,
		cellphone = obj.cellphone,
		portrait = obj.portrait,
		sex = obj.sex,
		desc = obj.introduce,
		role_id = obj.roleId,
	}
end

function convert.user_new_to_old(obj)
	return {
		_id = obj.user_id,
		username = obj.username,
		displayName = obj.nickname,
		password = obj.password,
		email = obj.email,
		cellphone = obj.cellphone,
		portrait = obj.portrait,
		sex = obj.sex,
		introduce = obj.desc,
		roleId = obj.role_id,

		createTime = obj.create_time,
		updateTime = obj.update_time,
	}
end

function convert.site_old_to_new(obj)
	local data = {
		site_id = obj._id,
		username = obj.username,
		sitename = obj.name or obj.sitename,
		site_type = obj.type,
		visibility = obj.visibility,
		desc = obj.desc,
		tags = obj.tags,
		logo = obj.logoUrl,
		isolate_data_source = obj.isolateDataSource,
		site_data_source_id = obj.site_data_source_id,
	}

	if data.site_type == "personal" then
		data.site_type = const.SITE_TYPE_PERSONAL
	elseif data.site_type == "company" then
		data.site_type = const.SITE_TYPE_COMPANY
	elseif data.site_type == "organization" then
		data.site_type = const.SITE_TYPE_ORGANIZATION
	elseif data.site_type == "game" then
		data.site_type = const.SITE_TYPE_GAME
	end

	return data
end

function convert.site_new_to_old(obj)
	local data =  {
		_id = obj.site_id,
		name = obj.sitename,
		username = obj.username,
		sitename = obj.sitename,
		type = obj.site_type,
		visibility = obj.visibility,
		desc = obj.desc,
		tags = obj.tags,
		logoUrl = obj.logo,
		isolateDataSource = obj.isolate_data_source,
		site_data_source_id = obj.site_data_source_id,
	}

	if data.site_type == const.SITE_TYPE_PERSONAL then
		data.site_type = "personal"
	elseif data.site_type == const.SITE_TYPE_COMPANY then
		data.site_type = "company"
	elseif data.site_type == const.SITE_TYPE_ORGANIZATION then
		data.site_type = "organization"
	elseif data.site_type == const.SITE_TYPE_GAME then
		data.site_type = "game"
	end

	return data
end

function convert.vip_old_to_new(obj)
	return {
		vip_id = obj._id,
		username = obj.username,
		level = obj.vipLevel,
		start_date = obj.startDate,
		end_date = obj.endDate,
		--is_valid = obj.isValid,
	}
end

function convert.vip_new_to_old(obj)
	return {
		_id = obj.vip_id,
		username = obj.username,
		vipLevel = obj.level,
		startDate = obj.start_date,
		endDate = obj.end_date,
		isValid = obj.is_valid,
	}
end

function convert.data_source_old_to_new(obj)
	return {
		data_source_id = obj._id,
		username = obj.username,
		data_source_name = obj.name,
		type = obj.type,
		external_user_id = obj.dataSourceUserId,
		external_username = obj.dataSourceUsername,
		external_password = obj.dataSourcePassword,
		token = obj.dataSourceToken,
		api_base_url = obj.apiBaseUrl,
		raw_base_url = obj.rawBaseUrl,
	}
end

function convert.data_source_new_to_old(obj)
	return {
		_id = obj.data_source_id,
		username = obj.username,
		name = obj.data_source_name,
		type = obj.type,
		dataSourceUserId = obj.external_user_id,
		dataSourceUsername = obj.external_username,
		dataSourcePassword = obj.external_password,
		dataSourceToken = obj.token,
		apiBaseUrl = obj.api_base_url,
		rawBaseUrl = obj.raw_base_url,
	}
end

function convert.site_data_source_old_to_new(obj)
	return {
		site_data_source_id = obj._id,
		username = obj.username,
		sitename = obj.sitename,
		data_source_name = obj.dataSourceName,
		visibility = obj.visibility,
		project_name = obj.projectName,
		project_id = obj.projectId,
		root_path = obj.rootPath,
		last_commit_id = obj.lastCommitId,
		last_commit_id_update_time = obj.lastCommitIdUpdateTime,
		last_commit_id_update_flag = obj.updateFlag,

		type = obj.type,
		external_user_id = obj.dataSourceUserId,
		external_username = obj.dataSourceUsername,
		external_password = obj.dataSourcePassword,
		token = obj.dataSourceToken,
		api_base_url = obj.apiBaseUrl,
		raw_base_url = obj.rawBaseUrl,
	}
end

function convert.site_data_source_new_to_old(obj)
	return {
		_id = obj.site_data_source_id,
		username = obj.username,
		sitename = obj.sitename,
		dataSourceName = obj.data_source_name,
		visibility = obj.visibility,
		projectName = obj.project_name,
		projectId = obj.project_id,
		rootPath = obj.root_path,
		lastCommitId = obj.last_commit_id,
		lastCommitIdUpdateTime = obj.last_commit_id_update_time,
		updateFlag = obj.last_commit_id_update_flag,
		is_default = obj.is_default,

		type = obj.type,
		dataSourceUserId = obj.external_user_id,
		dataSourceUsername = obj.external_username,
		dataSourcePassword = obj.external_password,
		dataSourceToken = obj.token,
		apiBaseUrl = obj.api_base_url,
		rawBaseUrl = obj.raw_base_url,
	}
end

return convert
