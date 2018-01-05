
define([
	'app',
	'text!html/controller/user.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("userController",['$scope', function ($scope) {
		var $auth = app.ng_objects.$auth;
		var $rootScope = app.ng_objects.$rootScope;
		var username = undefined;
		

		function loadUserinfo() {
			if (!username) {
				return;
			}

			util.http("GET", config.apiUrlPrefix + "user/get_detail_by_username", {username:username}, function(data){
				data = data || {};
				$scope.userinfo = data.userinfo;
				$scope.visit_history = data.visit_history || [];
				$scope.latest_renew = data.latest_renew || [];
			})
		}

		function init() {
			var urlobj = util.parseUrl();
			username = urlobj.username;

			loadUserinfo();
		}

		$scope.$watch("$viewContentLoaded", init);

		$rootScope.$watch("user", function(user) {
			$scope.user = user;
			
			var urlobj = util.parseUrl();
			if (user && user.username && !urlobj.username) {
				username = user.username;
				loadUserinfo();
			}
		});
	}]);

	return htmlContent;
});
