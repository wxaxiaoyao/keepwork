
define([
	"app",
], function(app){
	var config = app.objects.config = {};

	config.apiUrlPrefix = "/api/v1/";
	return config;
})
