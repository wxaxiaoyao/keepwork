
define([
	'app',
	'text!html/controller/test.html',
], function (app, htmlContent) {
    app.registerController("testController",['$scope', function ($scope) {
		var $rootScope = app.ng_objects.$rootScope;
		$scope.message = "this is test";
		$scope.type = "info";
		$scope.node = {
			htmlContent:"node1",
			nodes:[
			{
				htmlContent:"node11",
			},
			{
				htmlContent:"node12",
				nodes:[
				{
					htmlContent:"node121",
				}
				]
			},
			],
		}
	}]);

	return htmlContent;
});
