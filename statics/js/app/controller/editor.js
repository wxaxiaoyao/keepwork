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
	var $rootScope = app.ng_objects.$rootScope;
	var util = app.objects.util;
	var config = app.objects.config;
	var storage = app.objects.storage;
	// git数据源
	var pageDB = undefined;
	var editor = undefined;
	var git = gitlab();

	var allPageMap = {};
	var curPage = undefined;

	storage.indexedDBRegisterOpenCallback(function(){
		pageDB = storage.indexedDBGetStore("sitepage");
	});

	//function format
	app.registerController("editorController", ["$scope", "$compile", function($scope, $compile){
		var stack = [];
		
		$scope.openedPageMap = {};

		function loadFilelist() {
			function loadUnSavePageContent(finish) {
				pageDB.get(function(x){
					console.log(x, allPageMap);
					if (!x || x.type == "tree" || !allPageMap[x.url]) {
						return;
					}
					var node = allPageMap[x.url];
					node.content = x.content;
					node.isModify = x.isModify;
					if (x.isModify && x.id != node.id) {
						node.isConflict = true;
					}
				}, function(){

				}, function(){
					finish && finish();
				});
			}

			function treeToMap(nodes) {
				for (var i = 0; i < nodes.length; i++) {
					var x = nodes[i];
					allPageMap[x.url] = x;

					treeToMap(x.nodes || []);
				}
			}

			util.http("GET", config.apiUrlPrefix + "data_source/get_default_data_source", {}, function(data){
				console.log(data);
				git.init(data);
				git.getTree({
					recursive: true,
					isFetchAll: true,
					path: "xiaoyao",
				}, function(datas){
					console.log(datas);
					if (datas.length == 1) {
						$scope.node = datas[0];
						$scope.node.text = "我的站点";
						$scope.node.isRootNode = true;
					}

					treeToMap(datas);
					loadUnSavePageContent(function(){
						util.$apply();
					});
				}, function(){

				});
			});
		}

		function init() {
			var $rootScope = app.ng_objects.$rootScope;

			initEditor();
			$scope.user = $scope.user || $rootScope.user;

			$rootScope.isShowHeader = false;

			loadFilelist();
		}

		function savePageToDB(node, success, error) {
			var x = {};
			x.url = node.url;
			x.content = node.content;
			x.isModify = node.isModify;
			x.path = node.path;
			x.id = node.id;
			x.name = node.name;
			x.type = node.type;
			x.username = node.username;

			pageDB.setItem(x, success, error);
		}

		function change(filename, text) {
			if (!curPage) {
				return;
			}
			
			if (curPage.url != filename) {
				console.log("文件不匹配");
				return;
			}
			//console.log(filename, text);
			if (curPage.content == text) {
				return;
			}

			curPage.content = text;
			curPage.isModify = true;
			
			savePageToDB(curPage);
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

			var page = curPage;

			git.writeFile({
				path:page.path, 
				content:page.content
			}, function(data){
				console.log("保存成功!!!");
				page.isModify = false;
				page.isConflict = false;
				pageDB.deleteItem(page.url);
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

			$scope.openedPageMap[node.url] = node;
			curPage = node;
			editor.swapDoc(node.url, node.content);
			$scope.curPage = curPage;
		}
		
		// 获取页面内容  1 读本地数据库 2 都服务器
		function getPageContent(node, success, error) {
			if (node.content != undefined) {
				success && success(node.content);
				return;
			}
			// 获取服务器对应文件内容
			function getGitContent() {
				if (!git) {
					error && error();
					return;
				}

				git.getContent({path:node.path}, function(content) {
					//node.content = content || "";
					success && success(content);
				}, function(){
					//console.log("获取文件内容失败:" + node.path);
					error && error();
				});
			}
			// 读取本地DB
			if (pageDB) {
				pageDB.getItem(node.url, function(data){
					if (data && data.id == node.id) {
						success && success(data.content);
						return;
					}

					getGitContent();
				}, function(){
					getGitContent();
				});
			} else {
				getGitContent();
			}
		}

		$scope.clickItem = function(node) {
			//console.log("点击文件项:", node);
			if (node.type == "tree") {
				stack.push($scope.node);
				$scope.node = node;
				return;
			}

			getPageContent(node, function(content){
				node.content = content || "";
				openPage(node);
			});
		}

		$scope.clickCloseBtn = function(node, $event) {
			delete $scope.openedPageMap[node.url];
			delete allPageMap[node.url];
			if ($event) {
				$event.stopPropagation();
			}

			if (curPage.url == node.url) {
				curPage = undefined;
				for (var key in $scope.openedPageMap) {
					curPage = $scope.openedPageMap[key];
				}
			}

			openPage(curPage);
			$scope.curPage = curPage;
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
			node.nodes.push({
				path: path,
				content:"",
				name: $scope.newItemName,
				text: $scope.newItemName,
				type: $scope.createItemType,
			});

			$scope.clickCancelCreateItem();
			if ($scope.createItemType == "tree") {
				git.writefile({
					path:path,
					content:"",
				}, function(data) {
					//util.$apply();
				});
			}
		}

		$scope.clickFixedConflict = function(node, $event) {
			if ($event) {
				$event.stopPropagation();
			}

			git.getContent({path:node.path}, function(content) {
				node.content = content;
				node.isConflict = false;
				pageDB.deleteItem(node.url);
				if (curPage && curPage.url == node.url) {
					openPage(curPage);
				}
			}, function(){
			});
		}

		$scope.clickAccessPage = function(node, $event) {
			if ($event) {
				$event.stopPropagation();
			}
			window.open(node.url);
		}

		$scope.clickGitBtn = function(node, $event) {
			if ($event) {
				$event.stopPropagation();
			}
			
			window.open(git.getGitFilePath({path:node.path}));
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

		$scope.clickViewModeCode = function() {
			editor.setViewMode(true, false);
		}
		$scope.clickViewModePreview = function() {
			editor.setViewMode(false, true);
		}
		$scope.clickViewModeCodePreview = function() {
			editor.setViewMode(true, true);
		}
		$scope.clickMyHomeBtn = function(){
			$rootScope.isShowHeader = true;
			util.go("/" + $scope.user.username);
		}
		$scope.clickSettingBtn = function() {
			$rootScope.isShowHeader = true;
			util.go("/www/user/setting");
		}
		$scope.clickLogoutBtn = function() {
			$rootScope.isShowHeader = true;
			$auth.logout();
			$rootScope.user = undefined;
			util.go("/www/login");
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
