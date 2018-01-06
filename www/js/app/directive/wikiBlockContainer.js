
define([
	'app',
	"helper/md/mdconf",
	"text!html/directive/wikiBlockContainer.html",
	'directive/wikiBlock',
], function(app, mdconf, wikiBlockContainerHtml){
    function getMd(mdName) {
		//return app.get('app.md.' + mdName);
		app.objects.mds[mdName] = app.objects.mds[mdName] || {};
		return app.objects.mds[mdName];
    }

    function extendBlock($scope, params, isTemplate) {
		//if ($scope.$kp_block) {
			//return $scope.$kp_block;
		//}

		var block = undefined;
		var mdName = undefined;
		var md = undefined;
		if (isTemplate) {
			mdName = decodeURI(params);
			md = getMd(mdName);
			//md = app.objects.mds[mdName];
			block = md.template;
		} else {
			block = $scope.$eval(params);
		}
		if(!block) {
            return block;
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
		
		md = getMd(block.mdName);
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
				var $rootScope = app.ng_objects.$rootScope;
				var block = extendBlock($scope, $attrs.params, $attrs.template);
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
