
define([
	'app',
	'helper/util',
	'text!html/controller/header.html',
], function (app, util, htmlContent) {
    app.registerController("headerController",['$scope', function ($scope) {
	}]);

	return htmlContent;
});
