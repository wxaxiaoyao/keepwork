
define([
	'app',
	'text!html/controller/user.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("userController",['$scope', function ($scope) {
		var $auth = app.ng_objects.$auth;

			
	}]);

	return htmlContent;
});
