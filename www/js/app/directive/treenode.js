
define([
	"app",
	"text!html/directive/treenode.html",
], function(app, htmlContent){
	var util = app.objects.util;
	app.registerDirective("treenode", ["$compile", function($compile){
		return {
			restrict: "EA",
			scope: true,
			//template: htmlContent,
			controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs){

				function init(){
					//console.log($attrs, $scope);
					$scope.node = $scope.$parent.$eval($attrs.node);
					$scope.level = parseInt($attrs.level) || $scope.$parent.$eval($attrs.level) || 0;
					if (!$scope.node) {
						return;
					}
					var node = $scope.node;
					var nodeHtml = node.htmlContent || $scope.$parent.$eval($attrs.nodeHtml || "nodeHtml") || "";
					$scope.nodeHtml = nodeHtml;
					$scope.style = {
						"padding-left":$scope.level * 20 + "px",	
					};

					htmlContent =  htmlContent.replace("nodeContent", nodeHtml);
					//console.log(htmlContent);
					$element.html($compile(htmlContent)($scope));
					util.$apply();

				}

				$scope.$watch(function(){
					return $scope.$parent.$eval($attrs.node);
				}, init);

				//$scope.$on("applyScope", function(){
					//util.$apply($scope);
				//});
			}],
		}
	}]);
});
