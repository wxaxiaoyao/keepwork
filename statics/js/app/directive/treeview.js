
define([
	"app",
	"text!html/directive/treeview.html",
], function(app, htmlContent) {
	var id = 1;
	function getId() {
		return id++;
	}
	// ng-repeat 会创建scope 写此指令复用ng-repeat的scope
	app.registerDirective("treenode", [function(){
		return {
			restrict:"A",
			template: htmlContent,
			controller:['$scope', '$element', '$attrs', function($scope, $element, $attrs){
				$scope.node = $scope.node || $scope.rootNode;
				$scope.rootNode = $scope.$eval("rootNode");

				var node = $scope.node, rootNode = $scope.rootNode;
				node.nodes = node.nodes || [];
				node.$kp_root_node = rootNode;
				node.$kp_id = getId();
				node.$kp_leaf = node.nodes.length == 0;
				node.$kp_style = node.$kp_style || angular.copy(rootNode.$kp_style);
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

				function init() {
					var rootNode = $scope.rootNode;
					rootNode.selectedBackgroundColor = rootNode.selectedBackgroundColor || "#3977AD";
					rootNode.backgroundColor = undefined;
					rootNode.multiSelect = rootNode.multiSelect || false;
					rootNode.$kp_selected_node = undefined;
					rootNode.$kp_selected = true;
					rootNode.$kp_style = {
						"color": rootNode.color,
						"background-color": rootNode.backgroundColor,
					};
					$scope.icon = rootNode.icon || "fa fa-chevron-right";
					$scope.selectedIcon = rootNode.selectedIcon || "fa fa-chevron-down";

					$scope.clickItem = function(node) {	
						var rootNode = node.$kp_root_node;
						console.log(node);
						//if (rootNode.multiSelect) {
							//toggleSelectItem(node);
							//rootNode.selectNode && rootNode.selectNode(node);
							//return ;
						//}
						// dan选
						var lastSelectNode = rootNode.$kp_selected_node;
						if (lastSelectNode) {
							// 是同一个节点
							if (lastSelectNode.$kp_id == node.$kp_id) {
								if (!lastSelectNode.$kp_leaf) {
								}
							}
							unselectItem(lastSelectNode);
						}
						toggleExpandItem(node);
						rootNode.$kp_selected_node = node;
						selectItem(rootNode.$kp_selected_node);
						rootNode.selectNode && rootNode.selectNode(node);
					};
				}

				function expandItem(node) {
					node.$kp_expanded = true;
				}

				function unexpandItem(node) {
					node.$kp_expanded = false;
				}
				function toggleExpandItem(node) {
					node.$kp_expanded = !node.$kp_expanded;
				}
				function selectItem(node) {
					var rootNode = node.$kp_root_node;
					node.$kp_selected = true;
					node.$kp_style["background-color"] = node.$kp_selected ? rootNode.selectedBackgroundColor : rootNode.backgroundColor;
				}	

				function unselectItem(node) {
					var rootNode = node.$kp_root_node;
					node.$kp_selected = false;
					node.$kp_style["background-color"] = node.$kp_selected ? rootNode.selectedBackgroundColor : rootNode.backgroundColor;
					
				}

				init();
			}],
		}
	}]);
});
