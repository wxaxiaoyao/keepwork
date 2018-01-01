
define([
	"app",
	"text!html/directive/treeview.html",
], function(app, htmlContent) {
	var id = 1;
	function getId() {
		return id++;
	}

	// 鼠标离开
	function mouseLeaveItem(node) {
		node = node || this;
		var rootNode = node.$kp_root_node;
		if (node.$kp_selected) {
			return;
		}
		node.$kp_style["background-color"] = rootNode.backgroundColor;
	}
	// 鼠标进入
	function mouseEnterItem(node) {
		node = node || this;
		var rootNode = node.$kp_root_node;
		if (node.$kp_selected) {
			return;
		}
		node.$kp_style["background-color"] = rootNode.onHoverBackgroundColor;
	}
	// 点击展开
	function clickExpand(node, $event) {
		node = node || this;
		$event.stopPropagation();
		toggleExpandItem(node);
	}
	// 鼠标点击
	function clickItem(node) {
		node = node || this;
		var rootNode = node.$kp_root_node;
		//if (rootNode.multiSelect) {
			//toggleSelectItem(node);
			//rootNode.selectNode && rootNode.selectNode(node);
			//return ;
		//}
		// 单选
		var lastSelectNode = rootNode.$kp_selected_node;
		if (lastSelectNode) {
			unselectItem(lastSelectNode);
			if (lastSelectNode.$kp_id != node.$kp_id) {
				selectItem(node);
			} 
		} else {
			selectItem(node);
		}
		rootNode.$kp_selected_node = node;
		//toggleExpandItem(node);
	}
	// 展开节点
	function expandItem(node) {
		node = node || this;
		node.$kp_expanded = true;
	}
	// 关闭节点
	function unexpandItem(node) {
		node = node || this;
		node.$kp_expanded = false;
	}
	function toggleExpandItem(node) {
		node = node || this;
		if (node.$kp_expanded) {
			unexpandItem(node);
		} else {
			expandItem(node);
		}
	}
	function selectItem(node) {
		var rootNode = node.$kp_root_node;
		node.$kp_selected = true;
		node.$kp_style["background-color"] = node.$kp_selected ? rootNode.selectedBackgroundColor : rootNode.backgroundColor;
		rootNode.selectNode && rootNode.selectNode(node);
	}	
	function unselectItem(node) {
		var rootNode = node.$kp_root_node;
		node.$kp_selected = false;
		node.$kp_style["background-color"] = node.$kp_selected ? rootNode.selectedBackgroundColor : rootNode.backgroundColor;
		rootNode.unselectNode && rootNode.unselectNode(node);
	}

	// ng-repeat 会创建scope 写此指令复用ng-repeat的scope
	app.registerDirective("treenode", [function(){
		return {
			restrict:"A",
			template: htmlContent,
			controller:['$scope', '$element', '$attrs', '$timeout', '$compile', function($scope, $element, $attrs, $timeout, $compile){
				$scope.node = $scope.node || $scope.rootNode;
				$scope.rootNode = $scope.$eval("rootNode");

				var node = $scope.node, rootNode = $scope.rootNode;
				node.nodes = node.nodes || [];
				node.$kp_root_node = rootNode;
				node.$kp_id = getId();
				node.$kp_leaf = node.nodes.length == 0;
				node.$kp_style = node.$kp_style || angular.copy(rootNode.$kp_style);
				node.$kp_selectItem = selectItem;
				node.$kp_unselectItem = unselectItem;
				node.$kp_expandItem = expandItem;
				node.$kp_unexpandItem = unexpandItem;
				node.$kp_hideExpandIcon = node.$kp_leaf;
				node.$kp_hideIcon = !node.$kp_leaf;
				node.$kp_itemLeftContainerId = "kp_treeview_item_left_container_" + node.$kp_id;
				node.$kp_itemRightContainerId = "kp_treeview_item_right_container_" + node.$kp_id;
				
				for (var i = 0; i < node.nodes.length; i++){
					node.nodes[i].$kp_level = node.$kp_level + 1;
					node.nodes[i].$kp_parent_node = node;
				}

				$timeout(function(){
					node.$kp_itemLeftContainer = angular.element("#" + node.$kp_itemLeftContainerId);
					node.$kp_itemRightContainer = angular.element("#" + node.$kp_itemRightContainerId);
					node.$kp_itemLeftContainer.css("width", node.$kp_level * rootNode.indentSize + "px");
					console.log(node.$kp_itemLeftContainer);
					if (node.leftContent) {
						node.$kp_itemLeftContainer.empty();
						node.$kp_itemLeftContainer.append($compile(node.leftText)($scope));
					} 
					if (node.rightText) {
						node.$kp_itemRightContainer.empty();
						node.$kp_itemRightContainer.append($compile(node.rightText)($scope));
					}
					$scope.$apply();
				});
			}],
		}

	}]);

	app.registerDirective("treeview", ["$compile", function($compile){
		return {
			restrict:"A",
			scope: true,
			template: '<div style="cursor:pointer;" treenode></div>',
			controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs){
				console.log($scope);
				$scope.rootNode = $scope.$eval($attrs.treeview);

				function init() {
					var rootNode = $scope.rootNode;
					rootNode.selectedBackgroundColor = rootNode.selectedBackgroundColor || "#3977AD";
					rootNode.onHoverBackgroundColor = rootNode.onHoverBackgroundColor || "#E6E6E6";
					rootNode.backgroundColor = undefined;
					rootNode.multiSelect = rootNode.multiSelect || false;
					rootNode.indentSize = rootNode.indentSize || 30;
					rootNode.$kp_level = rootNode.level || 0;
					rootNode.$kp_selected_node = undefined;
					rootNode.$kp_selected = true;
					rootNode.$kp_style = {
						"color": rootNode.color,
						"background-color": rootNode.backgroundColor,
					};
					rootNode.icon = rootNode.icon || "fa fa-file-text-o";
					rootNode.expandIcon = rootNode.expandIcon || "fa fa-chevron-down";
					rootNode.unexpandIcon = rootNode.unexpandIcon || "fa fa-chevron-right";

					$scope.clickItem = clickItem;
					$scope.clickExpand = clickExpand;
					$scope.mouseEnterItem = mouseEnterItem;
					$scope.mouseLeaveItem = mouseLeaveItem;
				}

				init();
			}],
		}
	}]);
});
