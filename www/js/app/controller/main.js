
define([
	'app',
	'controller/header',
	'controller/footer',
], function (app, headerContent, footerContent) {
	app.registerController("mainController",['$scope', function ($scope) {
		var util = app.objects.util;
		var config = app.objects.config;
		var mdwiki = app.objects.mdwiki;
		var dataSource = app.objects.dataSource;
		var $rootScope = app.ng_objects.$rootScope;
		var $auth = app.ng_objects.$auth;
		$rootScope.isShowHeader = true;
		$rootScope.isShowFooter = true;
		$rootScope.headerContent = headerContent;
		$rootScope.footerContent = footerContent;
		$rootScope.imgsPath = "assets/imgs/";
		
		function init(){
			util.replaceState({
				url:util.getAbsoluteUrl(),
				hash:window.location.hash,
			});
		}

		app.getUser(function(userinfo){
			init();
		}, function(){
			init();
		});

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
