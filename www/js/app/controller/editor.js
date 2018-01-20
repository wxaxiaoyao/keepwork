/**
 * Created by Administrator on 2017/12/3.
 */

define([
    'app',
	'helper/cmeditor',
	'controller/editorModuleEditor',
	'controller/editorFile',
	'controller/editorModule',
	'text!html/controller/editor.html',
], function (app, cmeditor,  editorModuleEditorHtml, editorFileHtml, editorModuleHtml, htmlContent) {
	var $auth = app.ng_objects.$auth;
	var $rootScope = app.ng_objects.$rootScope;
	var util = app.objects.util;

	var editor = undefined;
	var leftContainerElem = undefined;
	var rightContainerElem = undefined;
	var splitStripElem = undefined;
	var navBarWidth = "65px";

	//function format
	app.registerController("editorController", ["$scope", "$compile", function($scope, $compile){

		function cursorActivity(editor) {
			var editorModuleEditor = app.getShareObject("editorModuleEditor");
			var pos = editor.editor.getCursor();
			var blockList = editor.getBlockList();
			var block = undefined, tmp = undefined;
			for (var i = 0; i < blockList.length; i++) {
				tmp = blockList[i];
				if (pos.line >= tmp.token.start && pos.line < tmp.token.end) {
					block = tmp;
					break;
				}
			}
			editorModuleEditor.setBlock(block);
		}

		function initEditor() {
			editor = app.objects.editor = cmeditor({
				selector:"#editor", 
				$scope:$scope,
				cursorActivity:cursorActivity,
			});
		}

		function init() {
			var $rootScope = app.ng_objects.$rootScope;

			initEditor();
			$scope.user = $scope.user || $rootScope.user;

			$scope.isShowLeftPane = true;
			$scope.showOpenedList = true;
			$rootScope.isShowHeader = false;

			editorContainerElem = $(".kp_editor_container");
			leftContainerElem = $(".kp_editor_left_container");
			rightContainerElem = $(".kp_cmeditor_container");
			splitStripElem = $(".kp_editor_split_strip");
			initSplitStripDrag();

			$scope.viewList = [
			{
				type:"workspace-code-preview",
				text:"工作区-代码-预览",
				workspaceWidth: "300px",
			},
			{
				type:"code-preview",
				text:"代码-预览",
				workspaceWidth: "300px",
			},
			{
				type:"workspace-preview",
				text:"工作区-预览",
				workspaceWidth: "300px",
			},
			{
				type:"workspace-code",
				text:"工作区-代码",
				workspaceWidth: "300px",
			},
			{
				type:"code",
				text:"代码",
				workspaceWidth: "300px",
			},
			{
				type:"preview",
				text:"预览",
				workspaceWidth: "300px",
			},
			];
			$scope.viewtype = "workspace-code-preview";
			$scope.toggleLeftPane(true);

			$scope.workspaceContentList = [
			{
				type:"file",
				text:"文件",
				htmlContent: editorFileHtml,
			},
			{
				type:"module",
				text:"模块",
				htmlContent: editorModuleHtml,
			},
			{
				type:"moduleEditor",
				text:"编辑",
				htmlContent: editorModuleEditorHtml,
			},
			{
				type:"helper",
				text:"帮助",
			},
			];
			$scope.clickWorkspaceNavItem($scope.workspaceContentList[0]);
		}

		$scope.clickWorkspaceNavItem = function(x) {
			$scope.workspaceItem = x;
			$scope.workspaceContent = x.htmlContent || "<div>待实现</div>";
			if (x.type == "file") {
			} else if(x.type == "module") {
			} else if(x.type == "moduleEditor") {
			}
		}

		$scope.clickSwitchView = function(x) {
			$scope.viewtype = x.type;
			if (x.type == "workspace-code-preview") {
				editor.setViewMode(true, true);
				setLeftContainerWidth(x.workspaceWidth);
				$scope.isShowLeftPane = true;
			} else if(x.type == "workspace-preview") {
				editor.setViewMode(false, true);
				setLeftContainerWidth(x.workspaceWidth);
				$scope.isShowLeftPane = true;
			} else if(x.type == "workspace-code") {
				editor.setViewMode(true, false);
				setLeftContainerWidth(x.workspaceWidth);
				$scope.isShowLeftPane = true;
			} else if(x.type == "code-preview") {
				editor.setViewMode(true, true);
				setLeftContainerWidth(navBarWidth);
				$scope.isShowLeftPane = false;
			} else if(x.type == "code") {
				editor.setViewMode(true, false);
				setLeftContainerWidth(navBarWidth);
				$scope.isShowLeftPane = false;
			} else if(x.type == "preview") {
				editor.setViewMode(false, true);
				setLeftContainerWidth(navBarWidth);
				$scope.isShowLeftPane = false;
			}
		}

		$scope.toggleLeftPane = function(isShow, leftWidth) {
			$scope.isShowLeftPane = isShow == undefined ? !$scope.isShowLeftPane : isShow;

			if ($scope.isShowLeftPane) {
				$scope.viewtype = $scope.viewtype.indexOf("workspace-") == 0 ? $scope.viewtype : "workspace-" + $scope.viewtype;
				var workspaceWidth = navBarWidth;
				for (var i = 0; i < $scope.viewList.length; i++) {
					if($scope.viewtype == $scope.viewList[i].type) {
						workspaceWidth = $scope.viewList[i].workspaceWidth;
						break;
					}
				}
				setLeftContainerWidth(leftWidth || workspaceWidth);
			} else {
				$scope.viewtype = $scope.viewtype.indexOf("workspace-") == 0 ? $scope.viewtype.substring(10) : $scope.viewtype;
				setLeftContainerWidth(leftWidth || navBarWidth);
			}
		}

		function setLeftContainerWidth(width) {
			leftContainerElem.css("width", width);
			rightContainerElem.css("margin-left", width);
		}

		function initSplitStripDrag() {
			var startX = 0;
			var leftWidth = 0;
			var newLeftWidth = 0;
			var minWidth = parseInt(navBarWidth.substring(0, navBarWidth.length-2)) + splitStripElem.width();
			var maxWidth = editorContainerElem.width() * 0.4;
			//console.log(minWidth);
			var mousemoveEvent = function(event) {
				newLeftWidth = leftWidth + event.clientX - startX;
				if (newLeftWidth <= minWidth) {
					// 隐藏工作区
					$scope.toggleLeftPane(false);
				} else {
					newLeftWidth = newLeftWidth > maxWidth ? maxWidth : newLeftWidth;
					$scope.toggleLeftPane(true, newLeftWidth);
				}
				util.$apply();
			}
			var mouseupEvent = function() {
				if (newLeftWidth < (minWidth + 80)) {
					$scope.toggleLeftPane(false);
					util.$apply();
				}
				editorContainerElem.off("mouseup mouseleave", mouseupEvent);
				editorContainerElem.off("mousemove", mousemoveEvent);
			}
			splitStripElem.on("mousedown", function(event){
				leftWidth = leftContainerElem.width();
				startX = event.clientX;
				editorContainerElem.on("mouseup mouseleave", mouseupEvent);
				editorContainerElem.on("mousemove", mousemoveEvent);
			});
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
			app.setUser({});
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
