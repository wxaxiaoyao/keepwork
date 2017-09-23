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























