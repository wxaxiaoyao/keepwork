-- show databases;

-- create database keepwork;

-- use keepwork;
-- show tables;

-- 删除用户表
drop table if exists `user`;
-- 创建用户表
create table if not exists `user` (
	`user_id` bigint auto_increment primary key,   -- user_id
	`username` varchar(48) unique key,            -- 用户名
    `password` varchar(48) not null,              -- 密码
    
    `email` varchar(24),                          -- 邮箱
    `cellphone` char(12),                         -- 手机
    `nickname` varchar(48),                       -- 昵称
    `portrait` varchar(128),                      -- 头像url
    `sex` char(4),                                -- 性别
    `desc` varchar(128),                          -- 备注信息
    
    `role_id` int,                                 -- 角色_id  外键
    -- 创建 更新时间
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
    );
    
-- insert into user values(null, "xiaoyao", "wuxiangan", "hello xiaoyao",null,null);


-- 站点表
-- 删除站点表
drop table if exists `site`;
-- 创建站点表
create table if not exists `site` (
	`site_id` bigint auto_increment primary key,      -- site_id
    `site_type` int,                                  -- 站点类型
    `username` varchar(48) not null,                 -- 所属用户名
    `sitename` varchar(48) not null,                 -- 站点名
    
    -- `path`     varchar(128),                         -- 对应存贮路径  默认等同与sitename
	`visibility` char(12),                           -- 可见性 private public
    
    `index`    varchar(48),                          -- 首页名 默认index
    `tags`     varchar(128),                         -- 标签
	`logo`     varchar(128),                         -- logo
    
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 用户页面表
-- 删除用户页表
drop table if exists `page`;
-- 创建用户页表
create table if not exists `page` (
	`page_id` bigint auto_increment primary key,         -- page_id
    
    `username` varchar(48) not null,                    -- 所属用户
    `sitename` varchar(48),                             -- 所属站点  正常情况下不为空
    
    `pagename` varchar(48) not null,                    -- 页面名
    
    `url` varchar(1024) not null,                       -- url
    
    `tags` varchar(128),                                -- tags 
    `content`text,                                      -- 页面内容
	
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 数据源表
-- 删除数据源表
drop table if exists `data_source`;
-- 创建数据源表
create table if not exists `data_source` (
	`data_source_id` bigint auto_increment primary key,     -- dataSource_id
    `username` varchar(48) not null,                      -- 所属用户
    `data_source_name`  varchar(48) unique not null,                -- 数据源名称 此子段主要方便用户管理数据源
    
	`type` char(12) not null,                             -- 类型  gitlab  github
    `token` varchar(128) not null,                        -- 数据源token 访问数据的权限认证
    `api_base_url` varchar(64) not null,                    -- api url api基址
    `raw_base_url` varchar(64) not null,                    -- raw url 下载基址

	`external_user_id` bigint,                              -- 数据源用户_id
    `external_username` varchar(48),                       -- 数据源用户名
    `external_password` varchar(48),                       -- 数据源密码
    
    `is_default` tinyint default 0,                         -- 是否为默认数据源
    
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 站点数据源
drop table if exists `site_data_source`;
create table if not exists `site_data_source` (
	`site_data_source_id` bigint auto_increment primary key, -- _id
    
    `data_source_id` bigint not null,                        -- 引用的数据源
    `data_source_name` varchar(48),                          -- 引用的数据源名
    
    `site_id` bigint not null default 0,                               -- 站点id 与 站点一一对应
    
    `username` varchar(48) not null,                      -- 所属用户
    `sitename` varchar(48) not null,                      -- 所有站点
    
    `visibility` char(12) not null,                       -- 可见性 private public
    `project_id` bigint,                                   -- 数据源上的项目id
    `project_name` varchar(48) not null,                   -- 项目名
    `project_path` varchar(128),                  -- 项目路径 默认等同projectName

    `root_path` varchar(128),                              -- 页面存贮的根路径
    `last_commit_id` char(48),                              -- git last commit _id  下面两个字段是为避免被恶意更新commit _id设置， 响应git push事件无法辨认来源真实性
    `last_commit_id_update_time` int,                         -- git last commit _id update time
    `last_commit_id_update_flag` int,                         -- git last commit _id update flag  
    
    `is_default` tinyint default 0,                         -- 是否为默认数据源

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- domain 管理表
drop table if exists `domain`;
create table if not exists `domain` (
	`domain_id` bigint auto_increment primary key,          -- _id
    `username` varchar(48) not null,                       -- username
    `sitename` varchar(48) not null,                       -- sitename
    
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);



-- 用户账号绑定
drop table if exists `user_account`;
create table if not exists `user_account` (
	`user_account_id` bigint auto_increment primary key,       -- _id
	`username` varchar(48),                                  -- username
    
    `channel` char(24) not null,                             -- 账号所在服务商名
    `external_user_id` bigint,                                 -- 外部账号_id
    `external_username` varchar(48),                          -- 外部账号名
    `token` varchar(48),                                     -- token
    
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 用户组
drop table if exists `group`;
create table if not exists `group` (
	`group_id` bigint auto_increment primary key,              -- _id
    `username` varchar(48) not null,                          -- 用户名 所属用户
    `groupname` varchar(48) not null,                         -- 组名 方便管理
	-- `level` int not null,                                     -- 权限级别 
	-- `dataSourceGroup_id` bigint not null,                      -- 对应数据源组_id  实现依赖 应废弃

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 组用户
drop table if exists `group_user`;
create table if not exists `group_user` (
	`group_user_id` bigint auto_increment primary key,          -- _id
    `username` varchar(48) not null,                          -- 用户名 
    `groupname` varchar(48) not null,                         -- 组名   username-groupname 为外键 代替group_id  便于通过username查询
    `membername` varchar(48) not null,                        -- 组成员名
	-- `level` int not null,                                     -- 权限级别 

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 站点组
drop table if exists `site_group`;
create table if not exists `site_group` (
	`site_group_id` bigint auto_increment primary key,          -- _id
    `username` varchar(48) not null,                          -- 用户名 
    `groupname` varchar(48) not null,                         -- 组名   username-groupname 为外键 代替group_id  便于通过username查询
    `level` int not null,                                     -- 权限级别 

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 站点用户
drop table if exists `site_user`;
create table if not exists `site_user` (
	`site_user_id` bigint auto_increment primary key,           -- _id
    `username` varchar(48) not null,                          -- 用户名 
    `groupname` varchar(48) not null,                         -- 组名   username-groupname 为外键 代替group_id  便于通过username查询
    `membername` varchar(48) not null,                        -- 组成员名
    `level` int not null,                                     -- 权限级别 

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 用户活动图
drop table if exists `user_active`;
create table if not exists `user_active` (
	`user_active_id` bigint auto_increment primary key,         -- _id
    `username` varchar(48) not null,                          -- 用户名
    `year` int not null,                                      -- 年份
    `date` char(12),                                          -- 日期 2017-09-30
    `count` int not null default 0,                           -- 活跃度

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 粉丝表
drop table if exists `fans`;
create table if not exists `fans` (
	`fans_id` bigint auto_increment primary key,               -- _id
    `username` varchar(48) not null,                          -- 用户名
	`fans_username` varchar(48) not null,                      -- 粉丝用户名
	
    `fans_user_portrait` varchar(128),                          -- 粉丝用户头像
    -- ... 其它显示信息  冗余存贮 
    
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 收藏表  目前为站点收藏    wiki module 收藏可以考虑整合
drop table if exists `favorite`;
create table if not exists `favorite` (
	`favorite_id` bigint auto_increment primary key,           -- _id
    `username` varchar(48) not null,                          -- 用户名
    
    `site_id` bigint not null,                                 -- 收藏的站点
    `favorite_username` varchar(48) not null,                  -- 收藏的用户名
    `favorite_sitename` varchar(48) not null,                  -- 收藏的站点名

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 用户动态表
drop table if exists `trends`;
create table if not exists `trends` (
	`trends_id` bigint auto_increment primary key,              -- _id
    `username` varchar(48) not null,                           -- 用户名
    
    `object_id` bigint not null,                                -- 对象_id  站点_id 用户_id 作品_id  ...
	`type` int  not null,                                      -- 动态类型
	`desc` varchar(256),                                       -- 动态文本描述
    
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- 用户访问历史  目前只记录访问的站点历史
drop table if exists `visit_history`;
create table if not exists `visit_history` (
	`visitHistory_id` bigint auto_increment primary key,         -- _id
    
    `username` varchar(48) not null,                            -- 用户名
    `visit_username` varchar(48),                                -- 访问站点的用户名
    `visit_sitename` varchar(48),                                -- 访问站点的站点名  <=> site_id
    `url` varchar(256),                                         -- 访问的页面url
    
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- vip
drop table if exists `vip`;
create table if not exists `vip` (
	`vip_id` bigint auto_increment primary key,                  -- _id
    `username` varchar(48) not null,                            -- 用户名
	`level` int not null,                                       -- 等级
    `start_date` char(24) not null,                             -- 开始时间 
    `end_date` char(24) not null,                               -- 结束时间

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- vip trade
drop table if exists `vip_trade`;
create table if not exists `vip_trade` (
	`vip_trade_id` bigint auto_increment primary key,             -- _id
    `username` varchar(48) not null,                            -- 用户名	
    `price` int not null,                                       -- 价格
	`state` int not null,                                       -- 交易状态
    `comment` varchar(64),                                      -- 备注

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);


-- wiki module
drop table if exists `wiki_module`;
create table if not exists `wiki_module` (
	`wiki_module_id` bigint auto_increment primary key,           -- _id
    -- `username` varchar(48) not null,                         -- 用户名	
    `cmd_name`    varchar(128) unique not null,                  -- 命令名
    `module_name` varchar(48),                                   -- 模块名
	`module_logo` varchar(128),                                  -- 模块logo
    `classify_name` varchar(48),                                 -- 分类名 冗余设计 
    `classify_id` bigint,                                        -- 分类_id
    `content` text not null,                                    -- 内容
    `desc` varchar(128),                                        -- 描述信息
    `flag` int,                                                 -- 标志 是否为热门模块 
	`use_count` int default 0,                                  -- 使用次数
    `favorite_count` int default 0,                             -- 收藏次数
    
    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);

-- wiki moduel classify  关系型数据库可不用此表，可通过sql分组实现
drop table if exists `wiki_module_classify`;
create table if not exists `wiki_module_classify` (
	`wiki_module_classify_id` bigint auto_increment primary key,    -- _id
    `classify_name` varchar(48) unique not null,                  -- 分类名
    `desc` varchar(128),                                         -- 描述信息

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);



-- wiki module db 模块使用的数据表 表名约定以mod为前缀
-- 站点成员表
drop table if exists `mod_site_member`;
create table if not exists `mod_site_member` (
	`mod_site_member_id` bigint auto_increment primary key,         -- _id
    `site_id` bigint not null,                                    -- 站点_id
	`siteType` int not null,                                     -- 站点类型
    `member_mame` varchar(48) not null,                           -- 成员名 
    `member_portrait` varchar(128),                               -- 成员头像
    `role_name` varchar(12),                                      -- 角色名
    `desc` varchar(64),                                          -- 描述信息
    `state` int,                                                 -- 状态 是否通过审核

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);

-- 站点的作品表
drop table if exists `mod_site_works`;
create table if not exists `mod_site_works` (
	`mod_site_works_id` bigint auto_increment primary key,          -- _id
    `site_id` bigint not null,                                    -- 站点_id
	`author` varchar(48) not null,                               -- 关联username
    `title` varchar(256),                                        -- 标题
	-- `name`  varchar(64),                                      -- 作品名  用title
    `url` varchar(128),                                          -- 作品链接
    `logo` varchar(128),                                         -- 作品logo 
    `desc` varchar(128),                                         -- 描述信息
    `state` int,                                                 -- 状态 
    `flag` int,                                                  -- 标志   
    `visit_count` int,                                            -- 访问次数

    `create_time` timestamp default current_timestamp,
    `update_time` timestamp default current_timestamp on update current_timestamp
);

-- drop table if exists `mod_site_apply`;
-- create table if not exists `mod_site_apply` (
-- 	`modSiteApply_id` bigint auto_increment primary key,          -- _id
--     
--     `site_id` bigint not null,                                    -- 站点_id
--     `apply_id` bigint not null,                                   -- 申请_id   
--     `applyType` int,                                             -- 申请类型
--     
--     `create_time` timestamp default current_timestamp,
--     `update_time` timestamp default current_timestamp on update current_timestamp
-- );
