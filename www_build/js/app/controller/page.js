
define([
	'app',
	'helper/dataSource/gitlab',
	'text!html/controller/page.html',
], function (app, gitlab, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;
	var storage = app.objects.storage;
	var git = gitlab();

    app.registerController("pageController",['$scope', function ($scope) {
		var $rootScope = app.ng_objects.$rootScope;
		var $auth =app.ng_objects.$auth;

		$scope.levelList = [{
			level:10,
			name: "拒绝",
		}, {
			level:20,
			name:"只读",
		}, {
			level:30,
			name:"读写",
		}, {
			level:40,
			name:"完全控制",
		}, {
			level:50,
			name:"所属",
		}];
		


		function init() {
			getFolderList();
			getUserGroupList();
		}

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
});
