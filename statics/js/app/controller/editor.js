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
	var editor = undefined;

	var allPageMap = {};
	var curPage = undefined;
	//function format
	app.registerController("editorController", ["$scope", "$compile", function($scope, $compile){
		var stack = [];
		
		$scope.openedPageMap = {};
		function init() {
			var $rootScope = app.ng_objects.$rootScope;

			initEditor();
			$scope.user = $scope.user || $rootScope.user;

			$rootScope.isShowHeader = false;

			git.init($scope.user.default_data_source);

			git.getTree({
				recursive: true,
				isFetchAll: true,
				path: "xiaoyao",
			}, function(datas){
				console.log(datas);
				if (datas.length == 1) {
					$scope.node = datas[0];
					$scope.node.text = "我的站点";
				}
			}, function(){

			});
		}

		function change(filename, text) {
			if (!curPage) {
				return;
			}
			
			//console.log(filename, text);
			curPage.content = text;
		}

		function initEditor() {
			editor = cmeditor({
				selector:"#editor", 
				$scope:$scope,
				change: change,
				keyMap:{
					"F11": function(cm) {
						console.log("---------");
					},
					"ESC": function(cm) {

					},
					"Ctrl-S": function(cm) {
						$scope.cmd_save();
					},
				}
			});
		}

		$scope.cmd_save = function() {
			if (!curPage) {
				return;
			}

			git.writeFile({
				path:curPage.path, 
				content:curPage.content
			}, function(){
				console.log("保存成功!!!");
			});
		}

		$scope.clickBackwardBtn = function() {
			if (stack.length == 0) {
				return;
			}
			$scope.node = stack.pop();
		}

		// 打开站点页
		function openPage(node) {
			if (!node) {
				editor.swapDoc(undefined);
				return;
			}

			$scope.openedPageMap[node.path] = node;
			curPage = node;
			editor.swapDoc(node.path, node.content);
		}
		
		$scope.clickItem = function(node) {
			console.log("点击文件项:", node);
			if (node.type == "tree") {
				stack.push($scope.node);
				$scope.node = node;
				return;
			}
			
			if (node.content != undefined) {
				openPage(node);
				return;
			}

			git.getContent({path:node.path}, function(content) {
				node.content = content || "";
				openPage(node);
			}, function(){
				console.log("获取文件内容失败:" + node.path);
			});
		}

		$scope.clickCloseBtn = function(node, $event) {
			delete $scope.openedPageMap[node.path];
			if ($event) {
				$event.stopPropagation();
			}

			if (curPage.path == node.path) {
				curPage = undefined;
				for (var key in $scope.openedPageMap) {
					curPage = $scope.openedPageMap[key];
				}
			}

			openPage(curPage);
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
			for (var i = 0; i < node.nodes.length; i++) {
				var temp = node.nodes[i];
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
			}, function(data) {
				node.nodes.push({
					path: data.file_path,
					name: $scope.newItemName,
					text: $scope.newItemName,
					type: $scope.createItemType,
				});
				$scope.clickCancelCreateItem();
				util.$apply();
			});
		}

		$scope.clickDeleteItem = function(node, index, $event) {
			if ($event) {
				$event.stopPropagation();
			}

			console.log(index, node);
			var x = node.nodes[index];
			git.deleteFile({
				path: x.path,
			}, function(){
				node.nodes.splice(index,1);	
			}, function(resp){
				console.log(resp);
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
