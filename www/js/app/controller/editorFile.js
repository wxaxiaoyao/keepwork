
define([
	"app",
	'text!html/partial/editorFileNode.html',
	'text!html/controller/editorFile.html',
], function(app, editorFileNodeHtml, htmlContent){
	var util = app.objects.util;
	var config = app.objects.config;
	var storage = app.objects.storage;

	var pageDB = undefined;
	var editor = undefined;
	var git = undefined;

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
		var $rootScope = app.ng_objects.$rootScope;

		$scope.fileNodeHtml = editorFileNodeHtml;
		$scope.openedPageMap = openedPageMap;
		$scope.node = userNode;
		$scope.showType = "list"; // tree list

		// 保存已打开的文件列表
		function saveOpenedPageList() {
			var list = [];
			for (var key in $scope.openedPageMap) {
				list.push(key);
			}

			storage.localStorageSetItem($scope.user.username + "_editorOpenedPageList", list);
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
				var openlist = storage.localStorageGetItem($scope.user.username + "_editorOpenedPageList");
				for (var i = 0; i < (openlist || []).length; i++) {
					var url = openlist[i];
					if (!allPageMap[url]) {
						continue;
					}
					if (allPageMap[url].username != $scope.user.username) {
						continue;
					}
					$scope.openedPageMap[url] = allPageMap[url];
				}

				if (window.location.hash) {
					var url = decodeURIComponent(window.location.hash.substring(2));
					var node = allPageMap[url];
					//console.log(node);
					openPage(node);
				}
			}

			// 远程加载
			app.getGit(function(data){
				git = data;
				// 本地加载
				console.log(data);
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
					$scope.node.type = "tree";
					$scope.node.showSubNode = false;
					$scope.node.text = "我的页面";
					$scope.node.isRootNode = true;

					userNode = $scope.node;
					treeToMap(datas);
				});
			});
		}

		//function cursorActivity(editor) {
			//console.log("------------");
		//}
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

			//editor.on("cursorActivity", cursorActivity);

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
			x.cursor = node.cursor;
			x.opened = node.opened;

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
			
			if (!page.isModify || page.isConflict) {
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
			page.isRefresh = true;
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
				page.isRefresh = false;
				page.id = git.sha(page.content);
				//pageDB.deleteItem(page.url);
				pageDB.setItem(page);
				success && success();

				// git sha 最好本地计算 避免发送请求 TODO
				//git.getFile({path:page.path}, function(data) {
					//page.id = data.blob_id;
					//pageDB.setItem(page);
				//});
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
				curPage.cursor = editor.editor.getCursor();
			}

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

		// 打开站点页
		function openPage(node) {
			if (!node) {
				editor.swapDoc(undefined);
				window.location.hash = "";
				return;
			}

			if (!$scope.openedPageMap[node.url]) {
				node.opened = true;
				$scope.openedPageMap[node.url] = node;
				saveOpenedPageList();
			}
			curPage = node;
			//console.log(curPage.id, git.sha(curPage.content));
			editor.swapDoc(node.url, node.content);
			editor.editor.setCursor(curPage.cursor || {
				line: editor.editor.lineCount(),
			});
			editor.editor.focus();
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

		$scope.clickBackwardBtn = function() {
			if (stack.length == 0) {
				$scope.node.showSubNode = !$scope.node.showSubNode;
				return;
			}
			$scope.node = stack.pop();
		}

		$scope.clickItem = function(node) {
			//console.log("点击文件项:", node);
			if (node.type == "tree") {
				if ($scope.showType == "list") {
					if ($scope.node.url != node.url) {
						stack.push($scope.node);
						$scope.node = node;
						node.showSubNode = true;
					} else {
						if (stack.length == 0) {
							$scope.node.showSubNode = !$scope.node.showSubNode;
						} else {
							$scope.node.showSubNode = false;
							$scope.node = stack.pop();
						}
					}
				} else {
					node.showSubNode = !node.showSubNode;
				}
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
			node.opened = false;
			
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

		$scope.clickNewFile = function(node, type, $event) {
			if ($event) {
				$event.stopPropagation();
			}

			$scope.clickCancelNewItem();

			$scope.newItemNode = node;
			$scope.newItemNode.newItemType = type;
			$scope.newItemNode.isNewItem = true;
			$scope.newItemNode.newItemName = "";
			setTimeout(function(){
				$("#fileInputId")[0].focus();
			});
		}

		$scope.clickCancelNewItem = function() {
			if ($scope.newItemNode) {
				$scope.newItemNode.isNewItem = false;
				$scope.newItemNode.newItemType = undefined;
				$scope.newItemNode.newItemName = "";
			}
			$scope.newItemNode = undefined;
			util.$apply();
		}

		$scope.clickNewItem = function() {
			if (!$scope.newItemNode || !$scope.newItemNode.newItemName) {
				$scope.clickCancelNewItem();
				return;
			}
			var node = $scope.newItemNode;
			for (var i = 0; i < node.nodes.length; i++) {
				var temp = node.nodes[i];
				if (temp.name == node.newItemName && temp.type == $scope.newItemType) {
					console.log("文件已存在");
					return;
				}
			}
			var path = node.path + "/" + node.newItemName + (node.newItemType == "tree" ? "/.gitkeep":".md");
			node.nodes.push({
				path: path,
				url: node.newItemType == "tree" ? path : (node.path + "/" + node.newItemName),
				pagename: node.newItemName,
				username: node.username,
				content:"",
				name: node.newItemName,
				text: node.newItemName,
				type: node.newItemType,
			});
			//util.$apply();

			$scope.clickCancelNewItem();
			if (node.newItemType == "tree") {
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

		$scope.clickDeleteItem = function(node, $event) {
			if ($event) {
				$event.stopPropagation();
			}

			var parentUrl = node.url.replace(/\/[^\/]*$/, "");
			var parentNode = allPageMap[parentUrl];
			if (!parentNode) {
				return;
			}

			var index = undefined;
			for (var i = 0; i < parentNode.nodes.length; i++) {
				if (parentNode.nodes[i].url == node.url){
					index = i;
					break;
				}
			}
			if (index == undefined) {
				return;
			}

			if (node.id) {
				deletePage(node, function(){
					parentNode.nodes.splice(index,1);	
				});
			} else {
				parentNode.nodes.splice(index,1);	
			}
		}

		$scope.clickOpenedListBtn = function(){
			$scope.showOpenedList = !$scope.showOpenedList;
		}
		$(document).keyup(function(event){
			//console.log(event.keyCode);
			if ($("#fileInputId").is(":focus")) {
				if(event.keyCode == "13" ) {
					$scope.clickNewItem();
				} else if (event.keyCode == "27") {
					$scope.clickCancelNewItem();
				}
			}
		});

		$scope.$watch("$viewContentLoaded", function(){
			app.getUser(function(user){
				$scope.user = user;
				init();
			});
		});
	}]);

	return htmlContent;
})
