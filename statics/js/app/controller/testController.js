
define([
	'app',
    'helper/mdwiki',
    'helper/util',
	'text!html/test.html',
], function (app, mdwiki, util, htmlContent) {
    app.registerController("testController",['$scope', function ($scope) {
		$scope.message = "this is a test";
	}]);

	return htmlContent;
});
