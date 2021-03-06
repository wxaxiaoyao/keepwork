
define([
	"app",
], function(app, attrs){
	var styleAttrMap = {}
	var tagId = 0;

	var attrs = {};
	attrs.class = []; // 标签类列表
	attrs.style = {
		//"display":'flex',
	}; // 标签样式

	var tag = {};

	tag.attrs = attrs;
	tag.children = [];
	tag.data = {};
	tag.type = "";
	tag.vars = {}; // 变量集 未自定义则不配置更改
	tag.styleCode = "";
	tag.styleList = [];
	tag.attrList = [];

	function isEmptyObject(obj) {
		for (var key in obj) {
			return false;
		}

		return true;
	}

	tag.setStyle = function(key, value) {

	}

	tag.getAttrsHtml = function(){
		var self = this;
		var str = "";
		var attrs = self.attrs;
		var vars = self.vars;
		var valPrefix = "params";
		if (self.varKey) {
			valPrefix += "." + self.varKey;
		}

		// 默认:params为tag全部参数
		str += ' :params="' + valPrefix + '"';

		// 具体指定参数到属性
		for (var key in vars) {
			var value = vars[key];
			if (value.$data && value.$data.type == "text" && value.$data.attrName) {
				str += ' ' + value.$data.attrName + '="' + valPrefix + "." + key + '.text"';
			}
		}

		for (var key in attrs) {
			var value = attrs[key];

			if (typeof(value) == "string") {
				str += " " + key + '="' + value + '"';
			}
		}


		var style = attrs.style || {};
		if (!isEmptyObject(style)) {
			str += " style=" + '"';
			for (var key in style) {
				str += key + ":" + style[key] + ";";
			}
			str += '"';
		}

		return str;
	}

	tag.getContentHtml = function() {
		var self = this;

		var content = "";

		// 获取字标签值
		for (var i = 0; i < self.children.length; i++) {
			var childTag = self.children[i];
			content += childTag.html();
		}

		// 获取内容变量值
		//for (var i = 0; i < self.vars.length; i++){
			//var v = self.vars[i];
			//if (v.$data.type == "text") {
				//content += v.text;
			//}
		//}

		return content;
	}

	tag.html = function(){
		var self = this;
		var htmlStr = "";
		// br img  input
		if (self.type == "br" || self.type == "img" || self.type == "input") {
			htmlStr = "<" + self.type + self.getAttrsHtml() + "/>";
		} else {
			htmlStr = "<" + self.type + self.getAttrsHtml() + ">" + self.getContentHtml() + "</" + self.type + ">";
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
			var result = subTag.findById(tagId);
			if (result){
				return result;
			}
		}

		return undefined;
	}

	tag.addTag = function(tag) {
		var self = this;

		if (!tag || typeof(tag) != "object") {
			return;
		}

		self.children.push(tag);
		tag.parentTag = self;

		return tag;
	}

	tag.getParams = function(params) {
		var self = this;

		params = params || {};
		if (!isEmptyObject(self.vars)) {
			params[self.varKey] = self.vars;
		}

		for(var i = 0; i < self.children.length; i++) {
			var _tag = self.children[i];
			_tag.getParams(params);
		}

		return params;
	}

	function tagFactory(typ) {
		var _tag = angular.copy(tag);

		_tag.tagId = "tagId_" + (new Date()).getTime() + "_" + tagId++;
		_tag.attrs.id = _tag.tagId;
		_tag.type = typ;
		_tag.varKey = _tag.tagId;

		return _tag;
	}

	return tagFactory;
});
