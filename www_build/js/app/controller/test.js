
define([
	'app',
	'text!html/controller/test.html',
], function (app, htmlContent) {
    app.registerController("testController",['$scope', function ($scope) {
		var $rootScope = app.ng_objects.$rootScope;
		$scope.message = "this is test";
		$scope.type = "info";

		app.ng_objects.$timeout(function(){
			console.log("------------");
			$scope.type = "warning";
			//$scope.message = "<H3>test</h3>";
		},2000);
	}]);

	return htmlContent;
});
