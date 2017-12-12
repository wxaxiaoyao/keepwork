
define([
	"text!wikimod/example/index.html",
], function(htmlContent){
	return {
		render: function(wikiBlock) {
			console.log(wikiBlock);
			wikiBlock.$scope.params = wikiBlock.modParams || {};
			return htmlContent;

		}
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
