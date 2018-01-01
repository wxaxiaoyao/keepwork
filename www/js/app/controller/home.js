
define([
	'app',
	'text!html/controller/home.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("homeController",['$scope', function ($scope) {
		var $auth =app.ng_objects.$auth;
	}]);

	return htmlContent;
});
