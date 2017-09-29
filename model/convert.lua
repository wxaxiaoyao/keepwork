-- title: data source
-- author: xiaoyao
-- date: 2017-9-28

local convert = {}


-- 用户信息转换
function convert:user_old_to_new(obj)
	return {
		user_id = obj._id,
		username = obj.username,
		nickname = obj.displayName,


	}
end

function convert:user_new_to_old(obj)
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
