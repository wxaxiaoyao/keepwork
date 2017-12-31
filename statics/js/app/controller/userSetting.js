define([
	'app',
	'text!html/controller/userSetting.html',

	'controller/file',
	'controller/profile',
	'controller/group',
	'controller/dataSource',
], function (app, userSettingHtml, fileHtml, profileHtml, groupHtml, dataSourceHtml) {
    app.registerController("userSettingController",['$scope', function ($scope) {
		var $rootScope = app.ng_objects.$rootScope;
		$scope.user = $scope.user || $rootScope.user;
		$scope.settingItemList = [
	   	{
			type:"profile",
			name:"我的资料",
		},
	   	{
			type:"file",
			name:"文件",
		},
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
			type = type || "profile";
			$scope.selectedSettingItem = type;

			if (type == "profile") {
				$scope.settingHtml = profileHtml;
			} else if(type == "file") {
				$scope.settingHtml = fileHtml;
			} else if (type == "group") {
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
