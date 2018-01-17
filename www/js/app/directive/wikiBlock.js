
define([
	'app',
], function(app) {
    // 定义扩展指令
    app.registerDirective("wikiBlock", ['$compile', function ($compile) {
        return {
            restrict:'E',
            controller: ['$scope', '$attrs', '$element', function ($scope, $attrs, $element) {
				var block = $scope.$kp_block;
				
				block.$render = function(htmlContent) {
					$element.html($compile(htmlContent)($scope));
					//console.log(htmlContent, block);
					setTimeout(function() { $scope.$apply(); });
				}
				
				if (block.htmlContent) {
					block.$render(block.htmlContent);
				}
            }],
        };
    }]);

})
