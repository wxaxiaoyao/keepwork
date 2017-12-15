
define([
	'app',
    'helper/mdwiki',
    'helper/util',
	'controller/headerController',
], function (app, mdwiki, util, headerContent) {
	app.registerController("mainController",['$scope', function ($scope) {
		$scope.headerContent = headerContent;
		$scope.imgsPath = "/assets/imgs/";
		
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
