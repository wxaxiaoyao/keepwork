
local share_data = {}

local data={
	dog=3,
	cat=4,
	pig=5
}

local count = 1

function share_data.getCount()
	count = count + 1

	return count
end


return share_data
