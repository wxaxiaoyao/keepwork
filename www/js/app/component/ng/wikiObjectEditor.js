
define([
	"app",
	"text!component/ng/wikiObjectEditor.html",
], function(app, htmlTpl){
	app.registerDirective("wikiObjectEditor", ["$compile", function($compile) {
		return {
			restrict:"E",
			template: htmlTpl,
			controller: ["$scope", "$attrs", "$element", function($scope, $attrs, $element){

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
				
				$scope.addListItem = function(data) {
					data.list.push(angular.copy(data.$data.subItemTpl));		
					//setTimeout(function(){
						//$scope.$apply();
					//});
				} 

				$scope.$watch($attrs.obj, function(data) {
					$scope.datas = getOrderDatas(data);
					//console.log(data, $scope.datas);
				});
			}],
		}
	}]);
	//var vue = app.vue;

	//vue.component("wiki-object-editor", {
		//template: htmlTpl,
		//props:["obj"],
		//data: function(){
			//var obj = this.obj;
			//var data = {obj:obj};
			//console.log(obj);
			//return data;
		//},
	//});
});
