

define([
	'app',
	'text!html/controller/group.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("groupController",['$scope', function ($scope) {
		var $auth = app.ng_objects.$auth;
		
	}]);

	return htmlContent;
});
