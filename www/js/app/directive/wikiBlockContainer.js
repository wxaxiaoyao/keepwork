
define([
	'app',
	"helper/md/mdconf",
	"text!html/directive/wikiBlockContainer.html",
	'directive/wikiBlock',
], function(app, mdconf, wikiBlockContainerHtml){
    function getMd(mdName) {
		//return app.get('app.md.' + mdName);
		//app.objects.mds[mdName] = app.objects.mds[mdName] || {};
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
		block.$scope = $scope;
		block.$apply = function() {
			setTimeout(function(){
				block.$scope && block.$scope.$apply();
				//if (block.isTemplate) {
					//for (var i = 0; i < block.blockList; i++) {
						//var tempBlock = block.blockList[i];
						//tempBlock.$scope && tempBlock.$scope.$apply();
					//}
				//}
			});
		};
		
		// 渲染模块
		//console.log(block);
		block.render && block.render();
		//md = app.objects.mds[mdName];
        if (!md.editable || !md.editor) {
            return block;
        }

        block.applyModParams = function(modParams) {
			console.log(block);

			if (!editor || !block.token) {
				return;
			}

            var from = block.token.start;
			var to = block.token.end;
			var editor = md.editor;
            modParams = modParams || block.modParams;

            //console.log(modParams);
            if (typeof(modParams) == "object") {
                //modParams = angular.toJson(modParams, 4);
                modParams = mdconf.jsonToMd(modParams);
            }

            editor.replaceRange(modParams + '\n', {line: from, ch: 0}, {
                line: to - 2,
                ch: 0
            });
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

				block.$element = $element;

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
