-- create database keepwork;

-- show tables;
-- drop table if exists `user`;

create table if not exists `user` (
	`userId` bigint auto_increment primary key,
	`username` varchar(48) unique key,
    `password` varchar(48) not null,
    `desc` varchar(120),
    `createTime` timestamp default current_timestamp,
    `updateTime` timestamp default current_timestamp on update current_timestamp
    );
    
insert into user values(null, "xiaoyao", "wuxiangan", "hello xiaoyao",null,null);