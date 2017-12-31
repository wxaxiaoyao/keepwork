
define([
	"app",
], function(app){
	var config = app.objects.config = {};

	config.apiUrlPrefix = "/api/v1/";

	config.officialHostnameList = [
		"localhost",
		"keepwork.com",
	];
	return config;
})
