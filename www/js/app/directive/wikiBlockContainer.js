
define([
	'app',
	"helper/md/mdconf",
	"text!html/directive/wikiBlockContainer.html",
	'directive/wikiBlock',
], function(app, mdconf, wikiBlockContainerHtml){
    function getMd(mdName) {
		return app.objects.mds[mdName];
    }

    function extendBlock($scope, mdName, index) {
		var md = getMd(mdName);
		var block = undefined;

		if (!md) {
			return;
		}
		if (index == undefined) {
			block = md.template;
		} else {
			block = md.template.blockList[index];
		}

		if(!block) {
            return;
		}
		
		$scope.$kp_block = block;
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
		
		//md = app.objects.mds[mdName];
        if (!md.editable || !md.editor) {
            return block;
        }


		return block;
    }

	// 定义模块编辑器
	app.registerDirective("wikiBlockContainer", ["$compile", function($compile){
		return {
			restrict:'E',
			//scope: true,
			//template: '<div><wiki-block data-params="$kp_block"></wiki-block></div>',
			template: wikiBlockContainerHtml,
			controller:['$scope', '$attrs', '$element', function($scope, $attrs, $element) {
				var index = $scope.$eval("$index");
				var mdName = decodeURI($attrs.params);
				var isTemplate = $attrs.template;
				var $rootScope = app.ng_objects.$rootScope;
				var block = extendBlock($scope, mdName, index);
				
				//console.log(block.isTemplate, mdName, index);
				if (!block) {
					return;
				}

				$scope.clickContainer = function($event) {
					if ($event) {
						$event.stopPropagation();
					}
					console.log(block);

					if (!block.isWikiBlock) {
						return;
					}
					
					$rootScope.$broadcast("moduleEditor", block);
					
				}
			}],
		}
	}]);
});
