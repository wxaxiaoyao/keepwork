
define([
	'app',
    'helper/md/mdwiki',
    'helper/util',
], function (app, mdwiki, util) {
    app.registerController("mainController",['$scope', function ($scope) {
		var urlObj = util.parseUrl();
		console.log(urlObj);

		if (!urlObj.username || urlObj.username == "www") {
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
