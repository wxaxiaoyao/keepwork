
define([
	'app',
	'text!html/controller/editorModuleEditor.html',
], function(app, htmlContent) {
	var $auth =app.ng_objects.$auth;
	var util = app.objects.util;
	var config = app.objects.config;

	var editorModuleEditor = app.getShareObject("editorModuleEditor");

	editorModuleEditor.getBlock = function() {
		return this.block;
	}

	editorModuleEditor.setBlock = function(block) {
		var oldBlock = this.block;
		if (oldBlock && oldBlock.applyModParams) {
			oldBlock.applyModParams();
		}

		this.block = block;
		this.datas = getOrderDatas(block.modParams);
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
		function init() {
			$scope.params = editorModuleEditor;
		}


		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
})
