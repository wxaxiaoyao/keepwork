
define([
	'app',
	'helper/util',
	'text!html/controller/login.html',
], function (app, util, htmlContent) {
    app.registerController("loginController",['$scope', function ($scope) {
	}]);

	return htmlContent;
});
