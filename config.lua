
-- 全局配置
local config = {
	server_type = "npl",   -- 服务器类型 npl, lua(lua-nginx)
	--server_type = "lua",   -- 服务器类型 npl, lua(lua-nginx)
	server_ip = nil,
	server_port = 88,

	-- 数据库配置
	database = {
		--db_type = "tabledb",  --  数据库类型: tabledb, mysql
		db_type = "mysql",  --  数据库类型: tabledb, mysql

		tabledb = {             -- tabledb 数据库配置
			path = "database/", -- 数据库路径
			-- sync_mode = true,   -- 是否为异步模式
		},

		mysql = {                   -- mysql 数据库配置
			db_name = "keepwork",   -- 数据库名
			username = "wuxiangan", -- 账号名
			password = "wuxiangan", -- 账号密码
			host = "127.0.0.1",     -- 数据库ip地址
			port = 3306,            -- 数据库端口
		}
	},

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
				--["host"] = "http:localhost:8088",
				--["token"] = "DgAMzoVYJY71inpyk2XG",
			},
			["sms"] = {
				["accountToken"] = "2030b26949574f0694413a4881caf0b8",
			},
		},
	}
}


return config
