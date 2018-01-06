
define([
	'app',
], function(app) {
    // 定义扩展指令
    app.registerDirective("wikiBlock", ['$compile', function ($compile) {
        return {
            restrict:'E',
            controller: ['$scope', '$attrs', '$element', function ($scope, $attrs, $element) {
				var block = $scope.$kp_block;
				//console.log(block);
				//if (!block) {
					//block = extendBlock($scope, $attrs.params);
				//}

				var oldHtmlContent;
				var render = function(newVal) {
					if (!newVal || oldHtmlContent == newVal) {
						return;
					}
					$element.html($compile(newVal)($scope));
					oldHtmlContent = newVal;
					setTimeout(function() { $scope.$apply(); });
				}
				$scope.$watch('$kp_block.htmlContent', render);
            }],
        };
    }]);

})
