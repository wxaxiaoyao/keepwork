
define([
	'app',
	'text!html/controller/dataSource.html',
], function (app, htmlContent) {
    app.registerController("dataSourceController",['$scope', function ($scope) {
		var $rootScope = app.ng_objects.$rootScope;
		var $auth = app.ng_objects.$auth;
		var util = app.objects.util;
		var config = app.objects.config;
		$scope.user = $scope.user || $rootScope.user;

		$scope.clickNewDataSource = function() {
			console.log($scope.newDataSource);
			var x = $scope.newDataSource;
			if (!x.data_source_name || !x.api_base_url || !x.raw_base_url || !x.token) {
				$scope.errMsg = "相关字段不能为空";
				return;
			}

			for (var i = 0; $scope.dataSourceList.length; i++) {
				var t = $scope.dataSourceList[i];
				if (!x.data_source_id && t.data_source_name == x.data_source_name) {
					$scope.errMsg = "数据源名已存在";
					return;
				}
			}

			util.http("POST", config.apiUrlPrefix + "data_source/set_data_source", x, function(){

			}, function(){

			});
		}
		function init(){
			util.http("GET", config.apiUrlPrefix + "data_source/get", {}, function(data){
				$scope.dataSourceList = data || [];
				console.log(data);
			}, function(){

			});

		}

		$scope.$watch("$viewContentLoaded", function(){
			if ($auth.isAuthenticated()) {
				init();
			} else {
				util.go("/www/login");
			}

		});
	}]);

	return htmlContent;
});
