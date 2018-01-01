
define([
	"text!wikimod/example/index.html",
], function(htmlContent){
	function render(wikiBlock) {
		app.registerController("exampleController", ["$scope", function($scope){
			//console.log($scope);
		}]);

		//console.log(wikiBlock);
		wikiBlock.$scope.params = wikiBlock.modParams || {};
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
