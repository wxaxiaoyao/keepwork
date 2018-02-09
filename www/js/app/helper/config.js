
define([
	"app",
], function(app){
	var config = app.objects.config = {};

	config.apiUrlPrefix = "/api/v1/";

	config.gitApiProxyUrlPrefix = "http://gitapi.localhost";

	if (window.location.host.indexOf("localhost") < 0) {
		var domains = window.location.host.split(".");
		var size = domains.length;
		config.gitApiProxyUrlPrefix = window.location.protocol + "//gitapi." + domains[size-2] + "." + domains[size-1]; 
	}

	config.pageSuffix = ".md";

	config.officialHostnameList = [
		"localhost",
		"keepwork.com",
		"wxaxiaoyao.cn",
	];

	config.componentPrefixName = "kp";

	config.CONST = {
		MD_MODE_PREVIEW : "preview",
		MD_MODE_NORMAL : "normal",
		MD_MODE_EDITOR : "editor",
	};

	return config;
})
