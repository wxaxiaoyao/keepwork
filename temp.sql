-- SET SQL_SAFE_UPDATES = 0;
-- use keepwork;
-- 
-- update data_source set is_default = 1;


select * from user;

delete from user where username="xiaoyao";

select * from `user`  where `password` = 'e20e5abb0034d75b264f3ace422e1eb8' and `username` = 'xiaoyao' limit 2;

select * from data_source;

select * from site_data_source;