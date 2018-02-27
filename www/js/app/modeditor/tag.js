
define([
	"app",
], function(app, attrs){
	var tagId = 0;

	var attrs = {};
	attrs.class = []; // 标签类列表
	attrs.style = {}; // 标签样式

	var tag = {};

	tag.attrs = attrs;
	tag.children = [];
	tag.type = "";
	tag.varValue = "";

	tag.attrstr = function() {
		var self = this;
		var str = "";
		var attrs = self.attrs;
		for (var key in attrs) {
			var value = attrs[key];

			if (typeof(value) == "string") {
				str += " " + key + '="' + value + '"';
			}
		}

		var style = attrs.style || {};
		str += " style=" + '"';
		for (var key in style) {
			str += key + ":" + style[key] + ";";
		}
		str += '"';

		return str;
	}

	tag.html = function(){
		var self = this;
		var htmlStr = "";
		// br img  input
		
		var content = "";
		for (var i = 0; i < self.children.length; i++) {
			var childTag = self.children[i];
			content += childTag.type == "" ? childTag.varValue : childTag.html();
		}

		if (self.type == "") {
			htmlStr = self.varValue;	
		} else if (self.type == "br" || self.type == "img" || self.type == "input") {
			htmlStr = "<" + self.type + self.attrstr() + "/>";
		} else {
			htmlStr = "<" + self.type + self.attrstr() + ">" + content + "</" + self.type + ">";
		}

		return htmlStr;
	}

	tag.findById = function(tagId) {
		var self = this;

		if (self.attrs.id == tagId) {
			return self;
		}

		for (var i = 0; i < self.children.length; i++) {
			var subTag = self.children[i];

			if (subTag.findById(tagId)){
				return subTag;
			}
		}

		return undefined;
	}

	tag.setType = function(typ) {
		var self = this;
		self.type = typ;

		if (typ == "span") {

		} else if (type == "p") {

		}
	}


	function tagFactory(typ) {
		var _tag = angular.copy(tag);

		_tag.tagId = "tagId_" + (new Date()).getTime() + "_" + tagId++;
		_tag.attrs.id = _tag.tagId;
		_tag.type = typ || "";


		if (_tag.type == "") {
			_tag.varKey = "tagVar_" + (tagId-1);
			_tag.varValue = "";
		}

		return _tag;
	}

	return tagFactory;
});
