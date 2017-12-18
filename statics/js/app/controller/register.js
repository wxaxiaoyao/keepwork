
define([
	'app',
	'text!html/controller/register.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("registerController",['$scope', function ($scope) {

		$scope.clickRegister = function() {
			var params = {
				username: $scope.username,
				password: $scope.password,
			};

			util.$http({
				method: "POST",
				url: config.apiUrlPrefix + "user/register",
				params: params,
				success: function(data) {
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
