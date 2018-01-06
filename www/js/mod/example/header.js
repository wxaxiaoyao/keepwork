
define([
	"text!wikimod/example/header.html",
], function(htmlContent){
	function initParams(wikiBlock) {
		var modParams = wikiBlock.modParams || {};
		var id = 0;
		modParams.title = modParams.title || {text:"Title"};
		modParams.title.$data = {
			type:"text",
			name:"标题",
			order:1,
			id: id++,
		}

		wikiBlock.modParams = modParams;
	}

	return function(wikiBlock) {
		initParams(wikiBlock);

		var $scope =  wikiBlock.$scope;
		$scope.params = wikiBlock.modParams || {};

		console.log($scope.params);


		return htmlContent;
	}
});
