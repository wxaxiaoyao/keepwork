
define([
	"app",
], function(app){
	var config = app.objects.config = {};

	config.apiUrlPrefix = "/api/v1/";

	config.gitApiProxyUrlPrefix = "http://gitapi.localhost";
	config.gitApiProxyUrlPrefix = window.location.origin + "//gitapi." + window.location.host; 

	config.officialHostnameList = [
		"localhost",
		"keepwork.com",
		"wxaxiaoyao.cn",
	];
	return config;
})
