
define([
	"text!wikimod/example/index.html",
], function(htmlContent){
	function render(wikiBlock) {
		//console.log(wikiBlock);
		var $scope =  wikiBlock.$scope;

		$scope.params = wikiBlock.modParams || {};

		$scope.change = function() {
			wikiBlock.applyModParams($scope.params);
		}
		return htmlContent;
	}
	return {
		render: render,
	}
	//function viewRender(wikiBlock) {
		//wikiBlock.$scope.params = wikiBlock.modParams;
		//console.log(wikiBlock);
		//return htmlContent;
	//}
	
	//function editRender(wikiBlock) {

	//}

	//return {
		//viewRender: viewRender,
		//editRender: editRender,
	//}
})
