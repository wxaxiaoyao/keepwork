define([
	'app',
	'text!html/controller/userSetting.html',

	'controller/dataSource',
], function (app, userSettingHtml, dataSourceHtml) {
    app.registerController("userSettingController",['$scope', function ($scope) {
		var $rootScope = app.ng_objects.$rootScope;
		$scope.user = $scope.user || $rootScope.user;

		function init(){
			$scope.settingHtml = dataSourceHtml;
		}
		$scope.$watch("$viewContentLoaded", init);
	}]);

	return userSettingHtml;
});
