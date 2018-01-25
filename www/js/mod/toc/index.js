
define([
	"text!wikimod/toc/index.html",
], function(htmlContent){

	function getTocTree(wikiBlock) {
		var md = app.objects.share.md;
		var blockList = md.template.blockList;

		var params = wikiBlock.modParams || {};
		var tree = {nodes:[]};
		var minLevel = params.min_level ? parseInt(params.min_level) : 1;
		var maxLevel = params.max_level ? parseInt(params.max_level) : 6;
		var curLevel = minLevel;
		var curNode = undefined;

		console.log(params, wikiBlock);
		for (var i = 0; i < blockList.length; i++) {
			var block = blockList[i];
			var token = angular.copy(block.token);

			if (!/^[hH][1-6]$/.test(token.tag)) {
				continue;
			}

			var level = parseInt(token.tag.substring(1));
			if (level < minLevel || level > maxLevel) {
				continue;
			}

			if (level == minLevel) {
				tree.nodes.push({
					nodes:[],
					token:token,
					block:block,
				});
				continue;
			}
			
			var node = tree;
			for (var j = minLevel; j < level; j++) {
				if (node.nodes.length == 0){
					node.nodes.push({nodes:[]});
				}
				node = node.nodes[node.nodes.length-1];
			}

			node.nodes.push({
				nodes:[],
			   	token:token,
				block:block,
			});
		}

		//console.log(blockList);
		return tree;
	}

	function render(wikiBlock) {
		if (!app.objects.share.md) {
			return;
		}

		var $scope = wikiBlock.$scope;

		$scope.template = app.objects.share.md.template;
		$scope.tree = getTocTree(wikiBlock);

		$scope.clickTocItem = function(x) {
			if (!x.block || !x.block.$element) {
				return;
			}	

			var element = x.block.$element;
			element[0].scrollIntoView();
			//$("html, body").animate({scrollTop: element.offset().top }, {duration: 500,easing: "swing"});
			//console.log(x);
		}

		return htmlContent;
	}

	return {
		render:render,
		forceRender:render,
	}
});
