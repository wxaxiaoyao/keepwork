-- title: vip
-- author: xiaoyao
-- date: 2017-9-28


local orm = require("orm/orm")

local user_active = commonlib.inherit(orm)

-- define table
user_active:tablename("user_active")
user_active:addfield("user_active_id", "number")
user_active:addfield("username", "string")
user_active:addfield("year", "number")
user_active:addfield("date", "string")
user_active:addfield("count", "number")
user_active:addfield("create_time", "string")
user_active:addfield("update_time", "string")


-- 增加用户活动记录数
function user_active:addcount(params)
	if not params.username or not params.year then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local date = params.date or commonlib.get_date()
	local count = params.count or 1

	local data = self:find_one({
		username = params.username,
		year = params.year,
		date = date
	})

	if not data then
		data = {
			username = params.username,
			year = params.year,
			date = date,
			count = 0
		}
	end

	data.count = data.count + count

	local err = self:upsert({
		username = params.username,
		year = params.year,
		date = date
	}, data)

	return errors:wrap(err)
end


-- 获得用户年活动数据
function user_active:get_year_data_by_username(params)
	if not params.username or not params.year then
		return errors:wrap(errors.PARAMS_ERROR)
	end

	local list = self:find({
		username = params.username,
		year = params.year,
		[orm.LIMIT] = 400,
	})

	local data = {
		username = params.username,
		year = params.year,
		active_data = {},
	}

	for _, x in ipairs(list) do
		data.active_data[x.date] = x.count
	end

	return errors:wrap(nil, data)
end

return user_active
