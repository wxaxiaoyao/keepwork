import _ from "lodash";

var styleAttrMap = {}
var tagId = 0;

var tag = {};

// style class 特殊处理  vue也特殊处理  保持一致
tag.__flag__ = true; // 用来识别是tag
tag.tagName = "";
tag.children = [];

tag.attrs = {};
tag.styles = {};
tag.classes = {};
tag.vars = undefined; // 变量集 未自定义则不配置更改

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

tag.getAttrsHtml = function(tagName){
	var self = this;
	var str = ' :style="tag.styles" :class="tag.classes"';
	var attrs = _.cloneDeep(self.attrs);
	var vars = self.vars;

	if (tagName && tagName.indexOf("el-") == 0) {

	} else {
		str += ' :tag="tag"';
	}
	// 具体指定参数到属性
	for (var key in vars) {
		var value = vars[key];
		var attrName = value.$data.attrName;
		var attrNamePrefix = value.$data.attrNamePrefix || "";
		var defaultValue = attrs[attrName];
		attrs[attrName] = undefined;

		defaultValue = defaultValue ? (" || '" + defaultValue + "'") : "";
		str += ' ' + attrNamePrefix + attrName + '="tag.vars.' + key + "." + (value.$data.key || 'text') + defaultValue + '"';
	}

	//str += " v-on:blur.native=blur";

	for (var key in attrs) {
		var value = attrs[key];

		if (typeof(value) == "string") {
			str += " " + key + '="' + value + '"';
		}
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

tag.html = function(opt){
	var self = this;
	var htmlStr = "";

	opt = opt || {};
	// br img  input
	if (self.tagName == "br" || self.tagName == "img" || self.tagName == "input") {
		htmlStr = "<" + self.tagName + self.getAttrsHtml() + "/>";
	} else {
		htmlStr = "<" + self.tagName + self.getAttrsHtml() + ">" + (opt.innerHtml || self.getContentHtml()) + "</" + self.tagName + ">";
	}

	return htmlStr;
}

tag.each = function(callback) {
	callback && callback(this);
	
	for (var i = 0; i < this.children.length; i++){
		this.children[i].each(callback);
	}	
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

	for (var i = 0; i < self.children.length; i++) {
		if (self.children[i].tagId == tag.tagId) {
			return;
		}
	}

	self.children.push(tag);
	tag.parentTag = self;

	return tag;
}

tag.deleteTag = function(tagId) {
	tagId = tagId || this.tagId;	
	var parentTag = this.parentTag;

	if (!parentTag && tagId == this.tagId){
		return;
	}

	if (tagId == this.tagId){
		parentTag.deleteTag(tagId);
	} else {
		for (var i = 0; i < this.children.length; i++){
			var childTag = this.children[i];
			if (childTag.tagId == tagId) {
				this.children.splice(i,1);
			} else {
				this.children[i].deleteTag(tagId);
			}
		}
	}
}

tag.getParams = function(params) {
	var self = this;

	params = params || {};
	if (!isEmptyObject(self.vars)) {
		if (self.varKey) {
			params[self.varKey] = self.vars;
		} else {
			_.merge(params, self.vars);
		}
	}

	for(var i = 0; i < self.children.length; i++) {
		var _tag = self.children[i];
		_tag.getParams(params);
	}

	return params;
}

tag.clone = function() {
	var _tag = _.cloneDeep(this);

	_tag.tagId = "tagId_" + (new Date()).getTime() + "_" + tagId++;
	_tag.attrs.id = _tag.tagId;
	_tag.varKey = _tag.tagId;

	return _tag;
}

tag.setTagName = function(tagName){
	this.tagName = tagName;
}

tag.setVars = function(vars) {
	this.vars = vars;
}

tag.getVars = function() {
	return this.vars;
}

function tagFactory(tagName) {
	var _tag = _.cloneDeep(tag);

	_tag.tagId = "tagId_" + (new Date()).getTime() + "_" + tagId++;
	_tag.attrs.id = _tag.tagId;
	_tag.tagName = tagName;
	_tag.varKey = _tag.tagId;

	return _tag;
}

export default tagFactory;
