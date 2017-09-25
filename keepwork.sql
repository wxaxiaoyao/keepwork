-- show databases;

-- create database keepwork;

-- use keepwork;
-- show tables;

-- 删除用户表
drop table if exists `user`;
-- 创建用户表
create table if not exists `user` (
	`userId` bigint auto_increment primary key,   -- userid
	`username` varchar(48) unique key,            -- 用户名
    `password` varchar(48) not null,              -- 密码
    
    `email` varchar(24),                          -- 邮箱
    `cellphone` char(12),                         -- 手机
    `nickname` varchar(48),                       -- 昵称
    `portriat` varchar(128),                      -- 头像url
    `sex` char(4),                                -- 性别
    `desc` varchar(128),                          -- 备注信息
    
    `roleId` int,                                 -- 角色id  外键
    -- 创建 更新时间
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
    );
    
-- insert into user values(null, "xiaoyao", "wuxiangan", "hello xiaoyao",null,null);


-- 站点表
-- 删除站点表
drop table if exists `site`;
-- 创建站点表
create table if not exists `site` (
	`siteId` bigint auto_increment primary key,      -- siteid
    `siteType` int,                                  -- 站点类型
    `username` varchar(48) not null,                 -- 所属用户名
    `sitename` varchar(48) not null,                 -- 站点名
    
    -- `path`     varchar(128),                         -- 对应存贮路径  默认等同与sitename
	`visibility` char(12),                           -- 可见性 private public
    
    `index`    varchar(48),                          -- 首页名 默认index
    `tags`     varchar(128),                         -- 标签
	`logo`     varchar(128),                         -- logo
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 用户页面表
-- 删除用户页表
drop table if exists `page`;
-- 创建用户页表
create table if not exists `page` (
	`pageId` bigint auto_increment primary key,         -- pageid
    
    `username` varchar(48) not null,                    -- 所属用户
    `sitename` varchar(48),                             -- 所属站点  正常情况下不为空
    
    `pagename` varchar(48) not null,                    -- 页面名
    
    `url` varchar(1024) not null,                       -- url
    
    `tags` varchar(128),                                -- tags 
    `content`text,                                      -- 页面内容
	
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 数据源表
-- 删除数据源表
drop table if exists `data_source`;
-- 创建数据源表
create table if not exists `data_source` (
	`dataSourceId` bigint auto_increment primary key,     -- dataSourceId
    `username` varchar(48) not null,                      -- 所属用户
    `dataSourceName` varchar(48) not null,                -- 数据源名称 此子段主要方便用户管理数据源
    
	`type` char(12) not null,                             -- 类型  gitlab  github
    `token` varchar(128) not null,                        -- 数据源token 访问数据的权限认证
    `apiBaseUrl` varchar(64) not null,                    -- api url api基址
    `rawBaseUrl` varchar(64) not null,                    -- raw url 下载基址

	`externalUserId` bigint,                              -- 数据源用户id
    `externalUsername` varchar(48),                       -- 数据源用户名
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 站点数据源
drop table if exists `site_data_source`;
create table if not exists `site_data_source` (
	`siteDataSourceId` bigint auto_increment primary key, -- id
    
    `dataSourceId` bigint not null,                       -- 引用的数据源
    `siteId` bigint not null,                             -- 站点id 与 站点一一对应
    
    `username` varchar(48) not null,                      -- 所属用户
    `sitename` varchar(48) not null,                      -- 所有站点
    
    `visibility` char(12) not null,                       -- 可见性 private public
    `projectId` bigint,                                   -- 数据源上的项目id
    `projectName` varchar(48) not null,                   -- 项目名
    `projectPath` varchar(128) not null,                  -- 项目路径 默认等同projectName
    
    `rootPath` varchar(128),                              -- 页面存贮的根路径
    `lastCommitId` char(48),                              -- git last commit id  下面两个字段是为避免被恶意更新commit id设置， 响应git push事件无法辨认来源真实性
    `lastCommitIdUpdateTime` int,                         -- git last commit id update time
    `lastCommitIdUpdateFlag` int,                         -- git last commit id update flag  
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- domain 管理表
drop table if exists `domain`;
create table if not exists `domain` (
	`domainId` bigint auto_increment primary key,          -- id
    `username` varchar(48) not null,                       -- username
    `sitename` varchar(48) not null,                       -- sitename
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);



-- 用户账号绑定
drop table if exists `user_account`;
create table if not exists `user_account` (
	`userAccountId` bigint auto_increment primary key,       -- id
	`username` varchar(48),                                  -- username
    
    `channel` char(24) not null,                             -- 账号所在服务商名
    `externalUserId` bigint,                                 -- 外部账号id
    `externalUsername` varchar(48),                          -- 外部账号名
    `token` varchar(48),                                     -- token
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 用户组
drop table if exists `group`;
create table if not exists `group` (
	`groupId` bigint auto_increment primary key,              -- id
    `username` varchar(48) not null,                          -- 用户名 所属用户
    `groupname` varchar(48) not null,                         -- 组名 方便管理
	-- `level` int not null,                                     -- 权限级别 
	-- `dataSourceGroupId` bigint not null,                      -- 对应数据源组id  实现依赖 应废弃

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 组用户
drop table if exists `group_user`;
create table if not exists `group_user` (
	`groupUserId` bigint auto_increment primary key,          -- id
    `username` varchar(48) not null,                          -- 用户名 
    `groupname` varchar(48) not null,                         -- 组名   username-groupname 为外键 代替groupId  便于通过username查询
    `memberName` varchar(48) not null,                        -- 组成员名
	-- `level` int not null,                                     -- 权限级别 

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 站点组
drop table if exists `site_group`;
create table if not exists `site_group` (
	`siteGroupId` bigint auto_increment primary key,          -- id
    `username` varchar(48) not null,                          -- 用户名 
    `groupname` varchar(48) not null,                         -- 组名   username-groupname 为外键 代替groupId  便于通过username查询
    `level` int not null,                                     -- 权限级别 

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 站点用户
drop table if exists `site_user`;
create table if not exists `site_user` (
	`siteUserId` bigint auto_increment primary key,           -- id
    `username` varchar(48) not null,                          -- 用户名 
    `groupname` varchar(48) not null,                         -- 组名   username-groupname 为外键 代替groupId  便于通过username查询
    `memberName` varchar(48) not null,                        -- 组成员名
    `level` int not null,                                     -- 权限级别 

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 用户活动图
drop table if exists `user_active`;
create table if not exists `user_active` (
	`userActiveId` bigint auto_increment primary key,         -- id
    `username` varchar(48) not null,                          -- 用户名
    `year` int not null,                                      -- 年份
    `active` text,                                            -- {'date':activeCount} json str
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 粉丝表
drop table if exists `fans`;
create table if not exists `fans` (
	`fansId` bigint auto_increment primary key,               -- id
    `username` varchar(48) not null,                          -- 用户名
	`fansUsername` varchar(48) not null,                      -- 粉丝用户名
	
    `fansUserPortrait` varchar(128),                          -- 粉丝用户头像
    -- ... 其它显示信息  冗余存贮 
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 收藏表  目前为站点收藏    wiki module 收藏可以考虑整合
drop table if exists `favorite`;
create table if not exists `favorite` (
	`favoriteId` bigint auto_increment primary key,           -- id
    `username` varchar(48) not null,                          -- 用户名
    
    `siteId` bigint not null,                                 -- 收藏的站点
    `favoriteUsername` varchar(48) not null,                  -- 收藏的用户名
    `favoriteSitename` varchar(48) not null,                  -- 收藏的站点名

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 用户动态表
drop table if exists `trends`;
create table if not exists `trends` (
	`trendsId` bigint auto_increment primary key,              -- id
    `username` varchar(48) not null,                           -- 用户名
    
    `objectId` bigint not null,                                -- 对象id  站点id 用户id 作品id  ...
	`type` int  not null,                                      -- 动态类型
	`desc` varchar(256),                                       -- 动态文本描述
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- 用户访问历史  目前只记录访问的站点历史
drop table if exists `visit_history`;
create table if not exists `visit_history` (
	`visitHistoryId` bigint auto_increment primary key,         -- id
    
    `username` varchar(48) not null,                            -- 用户名
    `visitUsername` varchar(48),                                -- 访问站点的用户名
    `visitSitename` varchar(48),                                -- 访问站点的站点名  <=> siteId
    `url` varchar(256),                                         -- 访问的页面url
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- vip
drop table if exists `vip`;
create table if not exists `vip` (
	`vipId` bigint auto_increment primary key,                  -- id
    `username` varchar(48) not null,                            -- 用户名
	`level` int not null,                                       -- 等级
    `startDate` char(24) not null,                             -- 开始时间 
    `endDate` char(24) not null,                               -- 结束时间

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- vip trade
drop table if exists `vip_trade`;
create table if not exists `vip_trade` (
	`vipTradeId` bigint auto_increment primary key,             -- id
    `username` varchar(48) not null,                            -- 用户名	
    `price` int not null,                                       -- 价格
	`state` int not null,                                       -- 交易状态
    `comment` varchar(64),                                      -- 备注

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);


-- wiki module
drop table if exists `wiki_module`;
create table if not exists `wiki_module` (
	`wikiModuleId` bigint auto_increment primary key,           -- id
    -- `username` varchar(48) not null,                         -- 用户名	
    `CmdName`    varchar(128) unique not null,                  -- 命令名
    `moduleName` varchar(48),                                   -- 模块名
	`moduleLogo` varchar(128),                                  -- 模块logo
    `classifyName` varchar(48),                                 -- 分类名 冗余设计 
    `classifyId` bigint,                                        -- 分类id
    `content` text not null,                                    -- 内容
    `desc` varchar(128),                                        -- 描述信息
    `flag` int,                                                 -- 标志 是否为热门模块 
	`useCount` int,                                             -- 使用次数
    `favoriteCount` int,                                        -- 收藏次数
    
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);

-- wiki moduel classify  关系型数据库可不用此表，可通过sql分组实现
drop table if exists `wiki_module_classify`;
create table if not exists `wiki_module_classify` (
	`wikiModuleClassifyId` bigint auto_increment primary key,    -- id
    `classifyName` varchar(48) unique not null,                  -- 分类名
    `desc` varchar(128),                                         -- 描述信息

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);



-- wiki module db 模块使用的数据表 表名约定以mod为前缀
-- 站点成员表
drop table if exists `mod_site_member`;
create table if not exists `mod_site_member` (
	`modSiteMemberId` bigint auto_increment primary key,         -- id
    `siteId` bigint not null,                                    -- 站点id
	`siteType` int not null,                                     -- 站点类型
    `memberName` varchar(48) not null,                           -- 成员名 
    `memberPortrait` varchar(128),                               -- 成员头像
    `roleName` varchar(12),                                      -- 角色名
    `desc` varchar(64),                                          -- 描述信息
    `state` int,                                                 -- 状态 是否通过审核

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);

-- 站点的作品表
drop table if exists `mod_site_works`;
create table if not exists `mod_site_works` (
	`modSiteWorksId` bigint auto_increment primary key,          -- id
    `siteId` bigint not null,                                    -- 站点id
	`author` varchar(48) not null,                               -- 关联username
    `title` varchar(256),                                        -- 标题
	-- `name`  varchar(64),                                      -- 作品名  用title
    `url` varchar(128),                                          -- 作品链接
    `logo` varchar(128),                                         -- 作品logo 
    `desc` varchar(128),                                         -- 描述信息
    `state` int,                                                 -- 状态 
    `flag` int,                                                  -- 标志   
    `visitCount` int,                                            -- 访问次数

    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
);

-- drop table if exists `mod_site_apply`;
-- create table if not exists `mod_site_apply` (
-- 	`modSiteApplyId` bigint auto_increment primary key,          -- id
--     
--     `siteId` bigint not null,                                    -- 站点id
--     `applyId` bigint not null,                                   -- 申请id   
--     `applyType` int,                                             -- 申请类型
--     
--     `createTime` timestamp default current_timestamp,
--     `updateTime` timestamp default current_timestamp on update current_timestamp
-- );
