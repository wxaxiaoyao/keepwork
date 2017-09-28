
-- 全局配置
local config = {
	["default"] = {
		root_dir="/root/workspace/lua/keepwork/",
		log={
			file=true,
			filename="/root/workspace/lua/keepwork/log.txt",
		},

		["account_info"] = {
			["email"] = {
				["url"] = "smtp.exmail.qq.com",
				["username"] = "noreply@mail.keepwork.com",
				["password"] = "Keepwork.123",
				["from"] = "noreply@mail.keepwork.com",
			},
			["qq"] = {
				["client_secret"] = "01bd221b70beee7ffc64230e4a261873",
			},
			["weixin"] = {
				["client_secret"] = "eed69599248b4e8096300910c1a56db4",
			},
			["github"] = {
				["client_secret"] = "e8ca5391317ddca9c0907811ed7a0a814880f9d1",
			},
			["xinlangweibo"] = {
				["client_secret"] = "1dacf114c693d67c382de8f1da225ebb",
			},
			["gitlab"] = {
				["host"] = "git.keepwork.com",
				["token"] = "uVtd6_fs82yHyyEZAtzy",
			},
			["sms"] = {
				["accountToken"] = "2030b26949574f0694413a4881caf0b8",
			},
		},
	}
}


return config
