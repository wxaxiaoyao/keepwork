
define([
	'app',
	'text!html/controller/login.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("loginController",['$scope', function ($scope) {
		var $auth = app.ng_objects.$auth;
		var $rootScope = app.ng_objects.$rootScope;
		
		$scope.clickLogin = function() {
			$rootScope.notifyContent = undefined;
			var params = {
				username: $scope.username,
				password: $scope.password,
			};
			util.$http({
				method:"POST",
				url: config.apiUrlPrefix + "user/login",
				params: params,
				success: function(data) {
					$auth.setToken(data.token);
					app.setUser(data.userinfo);
					util.go("/" + data.userinfo.username);
				},
				error: function(err) {
					$rootScope.notifyContent = err.message;
					console.log(err);
				},
			});
		}

		$(document).keyup(function(event){
			if (app.objects.current_url != "/www/login") {
				return;
			}
			if (event.keyCode == "13") {
				$scope.clickLogin();
			}
		});
	}]);

	return htmlContent;
});
