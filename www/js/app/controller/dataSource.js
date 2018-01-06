
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
		$scope.isModify = false;

		$scope.clickModifyDataSource = function(x) {
			$scope.dataSource = x;
			$scope.isModify = true;
			$("#newDataSourceId").collapse("show");
		}

		$scope.clickSetDataSource = function() {
			console.log($scope.dataSource);
			var x = $scope.dataSource;
			if (!x.data_source_name || !x.api_base_url || !x.raw_base_url || !x.token) {
				$scope.errMsg = "相关字段不能为空";
				return;
			}

			x.api_base_url = x.api_base_url.trim();
			x.raw_base_url = x.raw_base_url.trim();
			x.token = x.token.trim();

			if (!$scope.isModify) {
				for (var i = 0; i < $scope.dataSourceList.length; i++) {
					var t = $scope.dataSourceList[i];
					if (!x.data_source_id && t.data_source_name == x.data_source_name) {
						$scope.errMsg = "数据源名已存在";
						return;
					}
				}
			}

			util.http("POST", config.apiUrlPrefix + "data_source/set_data_source", x, function(){
				getDataSourceList();
				$scope.isModify = false;
				$scope.dataSource = {};
				$("#newDataSourceId").collapse("hide");
			}, function(){

			});
		}

		$scope.clickSetDefault = function(x) {
			util.http("POST", config.apiUrlPrefix + "data_source/set_default_data_source", {data_source_id: x._id}, function(){
				getDataSourceList();
				
				var user = app.objects.user;
				user.default_data_source = x;
				app.setUser(user);
			});
		}

		function getDataSourceList() {
			util.http("GET", config.apiUrlPrefix + "data_source/get", {}, function(data){
				$scope.dataSourceList = data || [];
				console.log(data);
			}, function(){

			});
		}

		function init(){
			getDataSourceList();
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
