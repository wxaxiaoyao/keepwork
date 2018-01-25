
define([
	"text!wikimod/npl_package_manager/index.html",
], function(htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

	var modName = "npl_package_manager";
	var apiUrlPrefix = config.apiUrlPrefix + "wikimod/" + modName + "/";

	function render(block) {
		//util.http("GET", apiUrlPrefix +  "package/get",{}, function(data){
			//console.log(data);
		//});
		
		return htmlContent;
	}

	return {
		render:render,
	}
})
