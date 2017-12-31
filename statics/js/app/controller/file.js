
define([
	'app',
	'text!html/controller/file.html',
], function (app, htmlContent) {
	var $auth = app.ng_objects.$auth;
	var $rootScope = app.ng_objects.$rootScope;
	var util = app.objects.util;
	var config = app.objects.config;
	var storage = app.objects.storage;

    app.registerController("fileController",['$scope', function ($scope) {
		var $auth =app.ng_objects.$auth;

		function init() {
		}

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
});
