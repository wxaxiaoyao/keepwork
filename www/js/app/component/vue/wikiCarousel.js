
define([
	"app",
	"text!component/vue/wikiCarousel.html",
], function(app, htmlTpl){
	var vue = app.vue;

	vue.component("wiki-carousel", {
		template: htmlTpl,
		props:["items"],
	});
})
