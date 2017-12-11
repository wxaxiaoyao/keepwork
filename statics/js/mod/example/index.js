
define([
	"text!wikimod/example/index.html",
], function(htmlContent){
	function render(wikiBlock) {

	}
	return {
		render: function(wikiBlock) {
			return htmlContent;
		}
	}
})
