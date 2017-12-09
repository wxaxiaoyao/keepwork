
define([
], function(htmlContent){
	return {
		render: function(wikiBlock) {
			return '<div>self temp</div><div>' + wikiBlock.templateContent + "<div>";
		}
	}
})
