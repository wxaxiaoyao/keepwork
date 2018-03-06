
define([
	"app",
	"text!component/vue/wikiCarousel.html",
], function(app, htmlTpl){
	var vue = app.vue;

	vue.component("wiki-carousel", {
		template: htmlTpl,
		props:{
			params:{
				type:Object,
				default: function(){
					return {
						items:[
						{
							//src:"http://www.runoob.com/try/bootstrap/layoutit/v3/default3.jpg"
						},
						{
							//src:"http://www.runoob.com/try/bootstrap/layoutit/v3/default3.jpg"
						},
						],
					}
				},
			},
		},
	});
})
