NPL.load("(gl)script/ide/commonlib.lua")
NPL.load("(gl)script/apps/WebServer/WebServer.lua")

nws = {
	config = {
		use_inner_server = false, -- 使用外部webserver
		server_type = "npl",   -- 服务器类型 npl, lua(lua-nginx)
		--server_type = "lua",   -- 服务器类型 npl, lua(lua-nginx)
		server_ip = nil,
		server_port = 8888,

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
	}
}

NPL.load("nws.loader")


WebServer:Start("www", nws.config.server_ip or "0.0.0.0", nws.config.server_port or 8888)


nws.get("/", function(ctx)
	ctx.response:send("hello world")
end)

function activate()
	nws.handle(msg)
end

NPL.this(activate)

