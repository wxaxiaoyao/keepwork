/**
 * Created by Administrator on 2017/12/3.
 */

define([
    'app',
	'markdown-it',
	'helper/cmeditor',
	'helper/dataSource/gitlab',
	'text!html/controller/editor.html',
], function (app, markdownit, cmeditor, gitlab, htmlContent) {
	var $auth = app.ng_objects.$auth;
	var util = app.objects.util;
	var config = app.objects.config;
	// git数据源
	var git = gitlab();

	//function format
	app.registerController("editorController", ["$scope", "$compile", function($scope, $compile){
		var stack = [];
		function init() {
			var $rootScope = app.ng_objects.$rootScope;
			var editor = cmeditor({selector:"#editor", $scope:$scope});

			$scope.user = $scope.user || $rootScope.user;

			$rootScope.isShowHeader = false;

			git.init($scope.user.default_data_source);

			git.getTree({
				recursive: true,
				isFetchAll: true,
				path: "xiaoyao",
			}, function(datas){
				console.log(datas);
				$scope.nodes = datas;
			}, function(){

			});
		}


		$scope.clickItem = function(node) {
			stack.push($scope.nodes);
			if (!node.nodes || node.nodes.length == 0) {
				return ;
			}
			$scope.nodes = node.nodes;
		}

		$scope.clickNewFile = function(node) {
			$scope.isCreateItem = true;
			$scope.createItemType = "blob";
		}

		$scope.clickNewDir = function(node) {
			$scope.isCreateItem = true;
			$scope.createItemType = "tree";
		}

		$scope.clickCreateItem = function(node) {
			if (!$scope.newItemName) {
				return;
			}
			for (var i = 0; i < $scope.nodes.length; i++) {
				var temp = $scope.nodes[i];
				if (temp.name == $scope.newItemName && temp.type == $scope.createItemType) {
					console.log("文件已存在");
					return;
				}
			}
			console.log($scope.createItemType, node, $scope.newItemName);
			var path = node.path + "/" + $scope.newItemName + ($scope.createItemType == "tree" ? "/.gitkeep":".md");
			git.writeFile({
				path:path,
				content:"",
			}, function(node) {
				$scope.nodes.push({
					path: node.file_path,
					name: $scope.newItemName,
					type: $scope.createItemType,
				});
				$scope.clickCancelCreateItem();
			});
		}

		$scope.clickCancelCreateItem = function() {
			$scope.isCreateItem = false;
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
	//return htmlContent;
})
