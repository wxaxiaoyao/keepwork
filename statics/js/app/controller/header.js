
define([
	'app',
	'text!html/controller/header.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;
    app.registerController("headerController",['$scope', function ($scope) {
		var $auth =app.ng_objects.$auth;
		var $rootScope = app.ng_objects.$rootScope;

		$scope.isAuth = $auth.isAuthenticated();

		$scope.clickMyHomeBtn = function(){
			util.go("/" + $scope.user.username);
		}

		$scope.clickSettingBtn = function() {
			util.go("/www/user/setting");
		}
		$scope.clickEditorBtn = function() {
			util.go("/www/editor");
		}

		$scope.clickLoginBtn = function() {
			util.go("/www/login");
		}

		$scope.clickRegisterBtn = function() {
			util.go("/www/register");
		}

		$rootScope.$watch("user", function(user) {
			console.log("---------------", user);
			$scope.user = user;
			$scope.isAuth = user != undefined;
		});

		$scope.clickLogoutBtn = function() {
			$auth.logout();
			$rootScope.user = undefined;
			util.go("/www/login");
		}
	}]);

	return htmlContent;
});
