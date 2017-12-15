
define([
	'app',
    'helper/mdwiki',
    'helper/util',
], function (app, mdwiki, util) {
	app.registerController("mainController",['$scope', function ($scope) {
		util.replaceState({url:util.getAbsoluteUrl()});
		//var urlObj = util.parseUrl();
		//console.log(urlObj);
		//util.replaceState()
		//if (!urlObj.username || urlObj.username == "www") {
			//var controllerName = "controller/" + (urlObj.sitename || "test") + "Controller";
			//require([
				//controllerName,
			//], function(htmlContent){
				//$scope.content = htmlContent;
				//$scope.$apply();
			//});
		//}
	}]);
});
