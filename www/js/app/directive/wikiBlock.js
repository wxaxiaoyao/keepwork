
define([
	'app',
], function(app) {
    // 定义扩展指令
    app.registerDirective("wikiBlock", ['$compile', function ($compile) {
        return {
            restrict:'E',
            controller: ['$scope', '$attrs', '$element', function ($scope, $attrs, $element) {
				var block = $scope.$kp_block;
				block.$scope = $scope;
				
				block.$render = function(htmlContent) {
					var self = this;
					self.$scope = $scope;
					$scope.$kp_block = self;

					$element.html($compile(htmlContent)($scope));
					//console.log(htmlContent, block);
					setTimeout(function() { 
						$scope.$apply(); 

						if (block.wikimod && block.wikimod.renderAfter) {
							block.wikimod.renderAfter(block);
						}
					});
				}
				
				if (block.htmlContent) {
					block.$render(block.htmlContent);
				} else {
					block.render();
				}
            }],
        };
    }]);

})
