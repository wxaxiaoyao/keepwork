
define([
	"app",
], function(app){
	var tag = {};

	tag.attrs = attrs;
	tag.children = [];
	tag.name = "div";

	tag.html = function(){
		var htmlStr = "";
		// br img  input
		
		var content = "";
		for (var i = 0; i < tag.childrens.length; i++) {
			var childTag = tag.children[i];
			content += typeof(childTag) == "string" ? childTag : childTag.html();
		}

		if (tag.name == "br" || tag.name == "img" || tag.name == "input") {
			htmlStr = "<" + tag.name + " " + tag.attrs.html() + " />";
		} else {
			htmlStr = "<" + tag.name + " " + tag.attrs.html() + " >" + content + "</" + tag.name + ">";
		}

		return htmlStr;
	}

	return tag;
});
