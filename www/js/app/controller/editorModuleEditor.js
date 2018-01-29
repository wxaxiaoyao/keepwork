
define([
	'app',
	'text!html/controller/editorModuleEditor.html',
], function(app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;
	var mdconf = app.objects.mdconf;
	//var md = app.objects.mdwiki({mode:"preview", containerId:"moduleEditorStyleContainer"});
	var editorModuleEditor = app.getShareObject("editorModuleEditor");

	// 默认显示类型
	editorModuleEditor.showType = "attrs";

	function getStyleList(block) {
		var styleList = block.wikimod.mod.getStyleList() || [];
		var styles = [];

		//console.log(block);
		for (var i = 0; i < (styleList || []).length; i++) {
			styles.push({
				isChange: true,
				//htmlContent: block.htmlContent,
				cmdName: block.cmdName,
				isTemplate: block.isTemplate,
				isWikiBlock: block.isWikiBlock,
			    mdName: undefined,	
				modParams: styleList[i],
				mode: config.CONST.MD_MODE_PREVIEW,
				render: block.render,
				wikimod: block.wikimod,
			});
		}

		//console.log(styleList);
		//console.log(styles);
		return styles;
	}

	editorModuleEditor.getBlock = function() {
		return this.block;
	}

	editorModuleEditor.applyModParams = function() {
		var block = this.block;
		if (!block || !block.applyModParams || !this.datas || !this.params){
			return;
		}

		var modParams = angular.copy(this.params);
		if (block.wikimod && typeof(block.wikimod.mod) == "object" && typeof(block.wikimod.mod.getModuleParams) == "function") {
			modParams = block.wikimod.mod.getModuleParams(modParams);
		}
		block.applyModParams(modParams);
	}

	editorModuleEditor.setShowType = function(showType) {
		this.showType = showType || "attrs";
	}

	editorModuleEditor.reload = function() {
		if (!this.block) {
			return;
		}
		var block = this.block;
		if (block && typeof(block.wikimod) == "object" && typeof(block.wikimod.mod) == "object") {
			if (typeof(block.wikimod.mod.getEditorParams) == "function") {
				this.params = block.wikimod.mod.getEditorParams(block.modParams);
				this.datas = getOrderDatas(this.params);
			} else {
				this.params = undefined;
				this.datas = undefined;
			}

			if (typeof(block.wikimod.mod.getStyleList) == "function") {
				this.styles = getStyleList(block);
			} else {
				this.styles = undefined;
			}
		} else {
			this.params = undefined;
			this.datas = undefined;
			this.styles = undefined;
		}
		util.$apply();
	}

	editorModuleEditor.setBlock = function(block) {
		if (this.block && block && this.block.token.start == block.token.start && (this.datas || this.styles)) {
			return;
		}

		//console.log(block, this);
		
		this.block = block;
		this.reload();
	}
	
	function getOrderDatas(modParams) {
		var datas = [];

		modParams = modParams || {};
		for (var key in modParams) {
			if (modParams[key].$data) {
				datas.push(modParams[key]);
			}
		}

		for (var i = 0; i < datas.length; i++) {
			for (var j = i + 1; j < datas.length; j++) {
				datas[i].$data.order = datas[i].$data.order || 0;
				datas[j].$data.order = datas[j].$data.order || 0;
				if (datas[i].$data.order < datas[j].$data.order) {
					var tmp = datas[i];
					datas[i] = datas[j];
					datas[j] = tmp;
				}
			}
		}

		return datas;
	}

    app.registerController("editorModuleEditorController",['$scope', function ($scope) {
		var $auth =app.ng_objects.$auth;
		function init() {
			$scope.params = editorModuleEditor;
			// 此行 防止没有显示 因为wikimod为异步， 执行此行做做重新检测
			editorModuleEditor.reload();
		}
			
		$scope.change = function(){
			//console.log($scope.params);
			editorModuleEditor.applyModParams();
		}

		// 更改样式
		$scope.clickSelectStyle = function(block) {
			var editBlock =editorModuleEditor.getBlock();
			if (editBlock && editBlock.applyModParams) {
				editBlock.applyModParams(block.modParams);

				editorModuleEditor.reload();
			}
		}

		$scope.clickNavItem = function(showType, $event) {
			$scope.params.showType = showType;

			$(".kp_nav_item_container .kp_active").removeClass("kp_active");
			$($event.target).addClass("kp_active");
			//console.log($event);
		}

		$scope.getStyleActiveClass = function(block) {
			if (block.modParams.design == editorModuleEditor.params.design) {
				return "kp_style_selected";
			}
			return undefined;
		}

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
})
