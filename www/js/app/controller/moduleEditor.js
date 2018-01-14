
define([
	'app',
	'text!html/controller/moduleEditor.html',
], function(app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;
	//var block = undefined;

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

    app.registerController("moduleEditorController",['$scope', function ($scope) {
		var $auth =app.ng_objects.$auth;
		//$scope.showType = "module_list";
		$scope.showType = "module_edit";
		function init() {
		}

		function initModuleEditor(block) {
			var oldBlock = $scope.block;
			if (oldBlock) {
				oldBlock.applyModParams();
			}

			if (!block) {
				$scope.showType = "module_list";
				$scope.block = undefined;
				$scope.datas = undefined;
				return;
			}

			$scope.block = block;
			$scope.datas = getOrderDatas(block.modParams);

			console.log($scope.datas);
		}

		$scope.$on("moduleEditor", function($event, block){
			initModuleEditor(block);
			console.log(block);
		});

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
})
