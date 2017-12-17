
define([
	'app',
	'text!html/controller/login.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("loginController",['$scope', function ($scope) {
		var $auth =app.ng_objects.$auth;
		
		$scope.clickLogin = function() {
			var params = {
				username: $scope.username,
				password: $scope.password,
			};
			util.$http({
				method:"POST",
				url: config.apiUrlPrefix + "user/login",
				params: params,
				success: function(data) {
					console.log(data);
					$auth.setToken(data.token);
					app.setUser(data.userinfo);
					util.go("/www/editor");
				},
				error: function(err) {

				}
			});
		}
	}]);

	return htmlContent;
});
