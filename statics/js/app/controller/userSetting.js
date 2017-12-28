define([
	'app',
	'text!html/controller/userSetting.html',

	'controller/group',
	'controller/dataSource',
], function (app, userSettingHtml, groupHtml, dataSourceHtml) {
    app.registerController("userSettingController",['$scope', function ($scope) {
		var $rootScope = app.ng_objects.$rootScope;
		$scope.user = $scope.user || $rootScope.user;
		$scope.settingItemList = [
	   	{
			type:"group",
			name:"组",
		},
	   	{
			type:"dataSource",
			name:"数据源",
		}
		];

		function init(){
			setSettingContent();
		}

		function setSettingContent(type) {
			type = type || "group";
			$scope.selectedSettingItem = type;

			if (type == "group") {
				$scope.settingHtml = groupHtml;
			} else if(type == "dataSource") {
				$scope.settingHtml = dataSourceHtml;
			}
		}

		$scope.clickSettingItem = function(x) {
			setSettingContent(x.type);
		}

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return userSettingHtml;
});
