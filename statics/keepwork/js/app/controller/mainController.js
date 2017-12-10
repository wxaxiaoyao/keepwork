
define([
	'app',
    'helper/mdwiki',
    'helper/util',
], function (app, mdwiki, util) {
    app.registerController("mainController",['$scope', function ($scope) {
		console.log($scope);

		var urlObj = util.parseUrl();

		if (urlObj.username || urlObj.username == "www") {
			var controllerName = "controller/" + (urlObj.sitename || "test") + "Controller";
			require([
				controllerName,
			], function(htmlContent){
				$scope.content = htmlContent;
				$scope.$apply();
			});
		}
	}]);
});
