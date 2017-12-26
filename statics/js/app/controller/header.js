
define([
	'app',
	'text!html/controller/header.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;
    app.registerController("headerController",['$scope', function ($scope) {
		var $auth =app.ng_objects.$auth;
		var $rootScope = app.ng_objects.$rootScope;

		$scope.clickMyHomeBtn = function(){
			util.go("/" + $scope.user.username);
		}

		$scope.clickLogoutBtn = function() {
			$auth.logout();
			$rootScope.user = undefined;
			util.go("/www/login");
		}
	}]);

	return htmlContent;
});
