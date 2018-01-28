
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

				
				block.$apply = function(callback) {
					setTimeout(function(){
						block.$scope && block.$scope.$apply();
					});

					callback && callback();
				};

				block.$render = function(htmlContent) {
					var self = this;
					self.$scope = $scope;
					$scope.$kp_block = self;

					$element.html($compile(htmlContent)($scope));

					self.$apply(function(){
						if (block.wikimod && block.wikimod.mod && block.wikimod.mod.renderAfter) {
							block.wikimod.mod.renderAfter(block);
						}
					});
				}

				//console.log("init block:" + block.cmdName);
				// 将htmlContent置空 确保初始化的render正确的执行
				block.htmlContent = undefined;
				block.render();
            }],
        };
    }]);

})
