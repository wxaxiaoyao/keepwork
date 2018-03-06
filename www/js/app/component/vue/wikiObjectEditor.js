
define([
	"app",
	"text!component/vue/wikiObjectEditor.html",
], function(app, htmlTpl){
	var vue = app.vue;

	vue.component("wiki-object-editor", {
		template: htmlTpl,
		props:["obj"],
		data: function(){
			var obj = this.obj;
			var data = {obj:obj};
			console.log(obj);
			return data;
		},
	});
});
