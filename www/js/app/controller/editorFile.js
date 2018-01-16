
define([
	"app",
	'helper/dataSource/gitlab',
	'text!html/controller/editorFile.html',
], function(app, gitlab, htmlContent){
	var $rootScope = app.ng_objects.$rootScope;
	var util = app.objects.util;
	var config = app.objects.config;
	var storage = app.objects.storage;

	var pageDB = undefined;
	var editor = undefined;
	var git = gitlab();

	var saveTimerMap = {};
	var saveInterval = 3 * 60 * 1000; // 保存间隔3分钟
	var allPageMap = {};
	var openedPageMap = {};
	var userNode = undefined;
	var curPage = undefined;

	var stack = [];
	storage.indexedDBRegisterOpenCallback(function(){
		pageDB = storage.indexedDBGetStore("sitepage");
	});

	app.registerController("editorFileController", ["$scope", function($scope){
		$scope.openedPageMap = openedPageMap;
		$scope.node = userNode;

		// 保存已打开的文件列表
		function saveOpenedPageList() {
			var list = [];
			for (var key in $scope.openedPageMap) {
				list.push(key);
			}

			storage.localStorageSetItem("editorOpenedPageList", list);
		}

		// 重新获取节点内容
		function updateNode(node, success, error) {
			node.isRefresh = true;
			git.getFile({path:node.path}, function(data) {
				node.id = data.blob_id;
				node.content = data.content;
				node.isConflict = false;
				node.isRefresh = false;
				node.isModify = false;
				pageDB.setItem(node);

				if (curPage && curPage.url == node.url) {
					openPage(curPage);
				}

				success && success(node);
			}, error);
		}

		// 加载pageDB中页面
		function loadFilelist() {
			function loadPageDB(finish) {
				pageDB.get(function(x){
					//console.log(x, allPageMap);
					if (!x || x.type == "tree") {
						return;
					}

					var node = allPageMap[x.url];
					if (!node) {
						//pageDB.deleteItem(x.url);
						allPageMap[x.url] = x;
						return;
					}

					if (!x.isModify && node.id != x.id) {
						pageDB.deleteItem(x.url);
						return;
					}

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
					if (!allPageMap[x.url]) {
						allPageMap[x.url] = x;
					} else {
						var node = allPageMap[x.url];
						// 严格控制异地编辑同一文件
						if (x.id != node.id) {
							if (node.isModify) {
								node.isConflict = true;
							} else {
								updateNode(node);
							}
						}
						nodes[i] = node;
					}

					treeToMap(x.nodes || []);
				}
			}

			// 加载已打开的文件列表
			function loadOpenedPageList() {
				var openlist = storage.localStorageGetItem("editorOpenedPageList");
				for (var i = 0; i < (openlist || []).length; i++) {
					var url = openlist[i];
					if (!allPageMap[url]) {
						continue;
					}
					$scope.openedPageMap[url] = allPageMap[url];
				}

				if (window.location.hash) {
					var url = window.location.hash.substring(2);
					var node = allPageMap[url];
					//console.log(node);
					openPage(node);
				}
			}

			// 远程加载
			util.http("GET", config.apiUrlPrefix + "data_source/get_default_data_source", {}, function(data){
				//console.log(data);
				git.init(data);
				
				// 本地加载
				loadPageDB(function(){
					loadOpenedPageList();
					util.$apply();
				});

				git.getTree({
					recursive: true,
					isFetchAll: true,
					path: $scope.user.username,
				}, function(datas){
					console.log(datas);
					if (datas.length == 1) {
						$scope.node = datas[0];
					} else {
						$scope.node = {
							url:$scope.user.username,
							path:$scope.user.username,
							nodes:[],
						}
					}
					$scope.node.showSubNode = false;
					$scope.node.text = "我的页面";
					$scope.node.isRootNode = true;

					userNode = $scope.node;
					treeToMap(datas);
				}, function(){

				});
			});
		}

		function init() {
			if (!app.objects.editor || editor) {
				//console.log("编辑器未初始化或重复初始化");
				return;
			}
			editor = app.objects.editor;

			editor.setOptions({
				change:change,
				fileUpload:fileUpload,
				save:save,
			});

			loadFilelist();
		}

		function savePageToDB(node, success, error) {
			var x = {};
			x.isModify = node.isModify;
			x.isConflict = node.isConflict;
			x.content = node.content;
			x.pagename = node.pagename;
			x.name = node.name;
			x.id = node.id;
			x.path = node.path;
			x.text = node.text;
			x.type = node.type;
			x.url = node.url;
			x.username = node.username;

			pageDB.setItem(x, success, error);
		}

		function deletePage(page, success, error) {
			if ($scope.openedPageMap[page.url]) {
				delete $scope.openedPageMap[page.url];
				saveOpenedPageList();
			}

			if (saveTimerMap[page.url]) {
				clearTimeout(saveTimerMap[page.url]);
				delete saveTimerMap[page.url];
			}

			delete allPageMap[page.url];
			pageDB.deleteItem(page.url);

			git.deleteFile({
				path: page.path,
			}, function(){
				util.http("POST", config.apiUrlPrefix + "page/delete_by_url", {url:page.url});
				pageDB.deleteItem(page.url);
				success && success();
			}, error);	
		}

		// 自动保存
		function autoSavePage(page) {
			var timer = saveTimerMap[page.url];
			
			if (!page.isModify) {
				return;
			}	

			timer && clearTimeout(timer);
			saveTimerMap[page.url] = setTimeout(function(){
				saveTimerMap[page.url] = undefined;

				if (!page.isModify) {
					return;
				}

				savePage(page, function(){
					console.log("自动保存成功");
				}, function(){
					console.log("自动保存失败");
				});
			}, saveInterval);
		}

		// 保存页面
		function savePage(page, success, error) {
			//console.log(page);
			page.isSaving = true;
			git.writeFile({
				path:page.path, 
				content:page.content
			}, function(){
				util.http("POST", config.apiUrlPrefix + "page/set_page", {
					pagename: page.pagename,
					username: page.username,
					url: page.url,
					content: page.content,
				});

				page.isModify = false;
				page.isConflict = false;
				page.isSaving = false;
				//pageDB.deleteItem(page.url);
				pageDB.setItem(page);
				success && success();
			}, error);
		}

		function change(filename, text) {
			if (!curPage) {
				return;
			}
			
			if (curPage.url != filename) {
				console.log("文件不匹配");
				return;
			}

			if (curPage.content != text) {
				curPage.content = text;
				curPage.isModify = true;
			}

			//console.log(filename, text);
			
			autoSavePage(curPage);
			savePageToDB(curPage);
		}

		function fileUpload(file, success, error) {
			var filename = "tmp/" + (file.filename || file.name || (new Date()).getTime());
			var content = file.content;
			if (/image\/\w+/.test(file.type)) {
				if (!file.name) {
					var imgType = file.type.match(/image\/([\w]+)/);
					filename += (imgType ? imgType[1] : "");
				}
				git.uploadImage({
					path: filename,
					content: content,
				}, success, error);
			} else {
				git.uploadImage({
					path: filename,
					content: content,
				}, success, error);
			}
		}


		function save() {
			if (!curPage) {
				return;
			}
			
			var page = curPage;
			savePage(page, function() {
				console.log("保存成功!!!");
			});
		}

		$scope.clickBackwardBtn = function() {
			if (stack.length == 0) {
				$scope.node.showSubNode = !$scope.node.showSubNode;
				return;
			}
			$scope.node = stack.pop();
		}

		// 打开站点页
		function openPage(node) {
			if (!node) {
				editor.swapDoc(undefined);
				window.location.hash = "";
				return;
			}

			if (!$scope.openedPageMap[node.url]) {
				$scope.openedPageMap[node.url] = node;
				saveOpenedPageList();
			}
			curPage = node;
			editor.swapDoc(node.url, node.content);
			$scope.curPage = curPage;

			window.location.hash = "#/" + curPage.url;
		}
		
		// 获取页面内容  1 读本地数据库 2 都服务器
		function getPageContent(node, success, error) {
			if (node.content != undefined) {
				success && success(node.content);
				return;
			}
			// 获取服务器对应文件内容
			function getGitContent() {
				node.isRefresh = true;
				git.getContent({path:node.path}, function(content) {
					//node.content = content || "";
					node.isRefresh = false;
					success && success(content);
				}, function(){
					//console.log("获取文件内容失败:" + node.path);
					node.isRefresh = false;
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
			if ($event) {
				$event.stopPropagation();
			}

			delete $scope.openedPageMap[node.url];
			//delete allPageMap[node.url];
			
			saveOpenedPageList();

			if (curPage && curPage.url == node.url) {
				curPage = undefined;
				for (var key in $scope.openedPageMap) {
					curPage = $scope.openedPageMap[key];
				}
			}

			openPage(curPage);
			$scope.curPage = curPage;
		}

		$scope.clickNewFile = function(node, type) {
			$scope.isCreateItem = true;
			$scope.createItemNode = node;
			$scope.createItemType = type;
			setTimeout(function(){
				$("#fileInputId")[0].focus();
			});
		}

		$scope.clickCancelCreateItem = function() {
			$scope.isCreateItem = false;
			$scope.newItemName = "";
			$scope.createItemNode = undefined;
			util.$apply();
		}

		$scope.clickCreateItem = function(node) {
			if (!$scope.newItemName || !$scope.createItemNode) {
				$scope.clickCancelCreateItem();
				return;
			}
			node = node || $scope.createItemNode;
			for (var i = 0; i < node.nodes.length; i++) {
				var temp = node.nodes[i];
				if (temp.name == $scope.newItemName && temp.type == $scope.createItemType) {
					console.log("文件已存在");
					return;
				}
			}
			//console.log($scope.createItemType, node, $scope.newItemName);
			var path = node.path + "/" + $scope.newItemName + ($scope.createItemType == "tree" ? "/.gitkeep":".md");
			node.nodes.push({
				path: path,
				url: $scope.createItemType == "tree" ? path : (node.path + "/" + $scope.newItemName),
				content:"",
				name: $scope.newItemName,
				text: $scope.newItemName,
				type: $scope.createItemType,
			});

			$scope.clickCancelCreateItem();
			if ($scope.createItemType == "tree") {
				git.writeFile({
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

			updateNode(node);
		}

		$scope.clickAccessPage = function(node, $event) {
			if ($event) {
				$event.stopPropagation();
			}
			window.open("/" + node.url);
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
			deletePage(node.nodes[index], function(){
				node.nodes.splice(index,1);	
			});
		}
		$scope.clickOpenedListBtn = function(){
			$scope.showOpenedList = !$scope.showOpenedList;
		}
		$(document).keyup(function(event){
			//console.log(event.keyCode);
			if ($("#fileInputId").is(":focus")) {
				if(event.keyCode == "13" ) {
					$scope.clickCreateItem();
				} else if (event.keyCode == "27") {
					$scope.clickCancelCreateItem();
				}
			}
		});

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
})
