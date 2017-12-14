
define([
	"app",
	"text!html/directive/treeview.html",
], function(app, htmlContent) {
	// ng-repeat 会创建scope 写此指令复用ng-repeat的scope
	app.registerDirective("treenode", [function(){
		return {
			restrict:"A",
			template: htmlContent,
			controller:['$scope', '$element', '$attrs', function($scope, $element, $attrs){
				$scope.node = $scope.node || $scope.rootNode;

			}],
		}

	}]);

	app.registerDirective("treeview", ["$compile", function($compile){
		return {
			restrict:"A",
			scope: true,
			template: '<div style="cursor:pointer;" treenode></div>',
			//template: htmlContent,
			controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs){
				console.log($scope);
				$scope.rootNode = $scope.$eval($attrs.treeview);
				//$scope.rootNode = $scope.node;

				var rootNode = $scope.rootNode;
				rootNode.$kp_selected = true;
				$scope.icon = rootNode.icon || "fa fa-chevron-right";
				$scope.selectedIcon = rootNode.selectedIcon || "fa fa-chevron-down";
				$scope.clickItem = function(node) {
					node.$kp_selected = !node.$kp_selected;
				}	
				//function formatNodes(node) {
					//var nodes = node.nodes || [];
					//for (var i = 0; i < nodes.length; i++) {
						//var n = nodes[i];
						//n.icon = n
					//}
				//}
			}],
		}
	}]);
});
