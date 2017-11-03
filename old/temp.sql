SET SQL_SAFE_UPDATES = 0;
-- use keepwork;
-- 
-- update data_source set is_default = 1;

use keepwork;

show databases;

select count(*) as count from user;

select * from user limit 100;

delete from user where username="xiaoyao";

select * from data_source;

select * from site_data_source;

select * from site;

delete from site;

select * from vip;

update vip set end_date="2018-09-29";

select * from data_source;

alter table user convert to character set utf8;

select * from `group`;

select * from group_user;

select * from site_group;

select * from fans;

select * from test;