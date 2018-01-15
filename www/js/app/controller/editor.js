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

			if (!block) {
				return;
			}

			var editorModuleEditor = app.getShareObject("editorModuleEditor");
			var tmp = editorModuleEditor.getBlock();
			if (!tmp || tmp.token.start != block.token.start) {
				editorModuleEditor.setBlock(block);
			}
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

			leftContainerElem = $(".kp_editor_left_container");
			rightContainerElem = $(".kp_cmeditor_container");
			splitStripElem = $(".kp_editor_split_strip");

			$scope.viewList = [
			{
				type:"workspace-code-preview",
				text:"工作区-代码-预览",
				workspaceWidth: "240px",
			},
			{
				type:"code-preview",
				text:"代码-预览",
				workspaceWidth: "240px",
			},
			{
				type:"workspace-preview",
				text:"工作区-预览",
				workspaceWidth: "360px",
			},
			{
				type:"workspace-code",
				text:"工作区-代码",
				workspaceWidth: "360px",
			},
			{
				type:"code",
				text:"代码",
				workspaceWidth: "360px",
			},
			{
				type:"preview",
				text:"预览",
				workspaceWidth: "360px",
			},
			];
			$scope.viewtype = "workspace-code-preview";

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
		$scope.toggleLeftPane = function() {
			$scope.isShowLeftPane = !$scope.isShowLeftPane;

			if ($scope.isShowLeftPane) {
				$scope.viewtype = $scope.viewtype.indexOf("workspace-") == 0 ? $scope.viewtype : "workspace-" + $scope.viewtype;
				var workspaceWidth = navBarWidth;
				for (var i = 0; i < $scope.viewList.length; i++) {
					if($scope.viewtype == $scope.viewList[i].type) {
						workspaceWidth = $scope.viewList[i].workspaceWidth;
						break;
					}
				}
				setLeftContainerWidth(workspaceWidth);
			} else {
				$scope.viewtype = $scope.viewtype.indexOf("workspace-") == 0 ? $scope.viewtype.substring(10) : $scope.viewtype;
				setLeftContainerWidth(navBarWidth);
			}
		}

		function setLeftContainerWidth(width) {
			leftContainerElem.css("width", width);
			rightContainerElem.css("margin-left", width);
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
