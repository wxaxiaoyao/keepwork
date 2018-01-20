
define([
	'app',
	'text!html/controller/editorModuleEditor.html',
], function(app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

	var editorModuleEditor = app.getShareObject("editorModuleEditor");

	editorModuleEditor.getBlock = function() {
		return this.block;
	}

	editorModuleEditor.applyModParams = function() {
		var block = this.block;
		if (!block || !block.applyModParams || !this.datas || !this.params){
			return;
		}

		var modParams = angular.copy(this.params);
		if (typeof(block.wikimod) == "object" && typeof(block.wikimod.getModuleParams) == "function") {
			modParams = block.wikimod.getModuleParams(modParams);
		}
		block.applyModParams(modParams);
	}

	editorModuleEditor.setBlock = function(block) {
		if (this.block && block && this.block.token.start == block.start && this.datas) {
			return;
		}

		this.block = block;
		//console.log(block);
		if (block && typeof(block.wikimod) == "object" && typeof(block.wikimod.getEditorParams) == "function") {
			this.params = block.wikimod.getEditorParams(block.modParams);
			this.datas = getOrderDatas(this.params);
		} else {
			this.params = undefined;
			this.datas = undefined;
		}

		//console.log(this);
		util.$apply();
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
			//util.$apply();
		}
			
		$scope.change = function(){
			//console.log($scope.params);
			editorModuleEditor.applyModParams();
		}
		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
})
