
define([
	'app',
], function(app) {
    // 定义扩展指令
    app.registerDirective("wikiBlock", ['$compile', function ($compile) {
        return {
            restrict:'E',
            controller: ['$scope', '$attrs', '$element', function ($scope, $attrs, $element) {
				var block = $scope.$kp_block;

				if (!block) {
					return;
				}

				block.$scope = $scope;

				
				block.$apply = function() {
					setTimeout(function(){
						//if (block.isTemplate) {
							//for (var i = 0; i < block.blockList.length; i++) {
								//var tmp = block.blockList[i];
								//tmp.$scope && tmp.$scope.$apply();
							//}
						//}
						block.$scope && block.$scope.$apply();
					});
				};

				block.$render = function(htmlContent) {
					var self = this;
					self.$scope = $scope;
					$scope.$kp_block = self;

					$element.html($compile(htmlContent)($scope));
					//console.log(htmlContent, block);
					setTimeout(function() { 
						$scope.$apply(); 

						if (block.wikimod && block.wikimod.mod && block.wikimod.mod.renderAfter) {
							block.wikimod.mod.renderAfter(block);
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
