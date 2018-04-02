import _ from "lodash";

var styleAttrMap = {}
var tagId = 0;

var tag = {};

// style class 特殊处理  vue也特殊处理  保持一致
tag.__flag__ = true; // 用来识别是tag
tag.tagName = "";
tag.children = [];

tag.attrs = {};
tag.styles = {
	//"height":"100%",
};
tag.classes = {};
tag.varsPrefix = "tag.vars";
tag.vars = undefined; // 变量集 未自定义则不配置更改
tag.$vars = {};       // var 描述
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
	var str = '';
	var attrs = _.cloneDeep(self.attrs);
	var vars = self.vars;
	var $vars = self.$vars;

	if (tagName && tagName.indexOf("el-") == 0) {

	} else {
		str += ' :tag="tag"';
	}
	// 具体指定参数到属性
	for (var key in vars) {
		var value = vars[key];
		var $data = $vars[key];
		if (!$data || !$data.attrName) {
			continue;
		}
		var attrName = $data.attrName;
		var attrNamePrefix = $data.attrNamePrefix || "";
		var defaultValue = attrs[attrName];
		attrs[attrName] = undefined;

		defaultValue = defaultValue ? (" || '" + defaultValue + "'") : "";
		str += ' ' + attrNamePrefix + attrName + '="tag.vars.' + key + ($data.key || '') + defaultValue + '"';
	}

	//str += " v-on:blur.native=blur";

	for (var key in attrs) {
		var value = attrs[key];

		if (!value) {
			continue;
		}

		if (typeof(value) == "string") {
			str += " " + key + '="' + value + '"';
		} else if (typeof(value) == "number") {
			str += " :" + key + '="' + value + '"';
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

	if (self.tagId == tagId) {
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

tag.findByPath = function(path, srcTag) {
	if (!path) {
		return undefined;
	}

	path = path.split("-");

	var	rootTag = srcTag || this;
	while(rootTag.parentTag) {
		rootTag = rootTag.parentTag;
	}

	var dstTag = rootTag;
	path.forEach(function(v) {
		dstTag = dstTag.children[_.toNumber(v)];	
	});

	return dstTag;
}

tag.getTagPath = function() {
	var path = [];
	var curTag = this;
	var parentTag = curTag.parentTag;

	while(parentTag) {
		var index = parentTag.children.findIndex(t => t.tagId == curTag.tagId);
		path.push(index);
		curTag = parentTag;
		parentTag = curTag.parentTag;
	}

	_.reverse(path);

	path = path.join("-");

	return path;
}

tag.setChildrenTag = function(index, tag) {
	var self = this;
	if (!tag || typeof(tag) != "object") {
		return;
	}

	self.children.splice(index, 1, tag);
	tag.parentTag = self;

	return
}

tag.addTag = function(t) {
	var self = this;

	if (!t || typeof(t) != "object") {
		return;
	}

	for (var i = 0; i < self.children.length; i++) {
		if (self.children[i].tagId == t.tagId) {
			return;
		}
	}

	self.children.push(t);
	t.parentTag = self;

	return t;
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
	_tag.varKey = _tag.tagId;

	return _tag;
}

tag.getNextTag = function() {
	var self = this;
	var parentTag = self.parentTag;
	if (!parentTag) {
		return undefined;
	}

	var index = parentTag.children.findIndex(t => t.tagId === self.tagId);

	if (index < 0 || (index + 1) >= parentTag.children.length) {
		return undefined;
	}

	return parentTag.children[index + 1];
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

tag.setVarsByKey = function(data) {
	data = data || {};
	
	const _setVarsByKey = function(tag) {
		if (tag.key && data[tag.key]) {
			tag.vars = _.merge(tag.vars || {}, data[tag.key]);
		}

		_.each(tag.children, _setVarsByKey);
	}

	_setVarsByKey(this);
}

tag.getVarsByKey = function(keys) {
	var data = {};
	const _getVarsBykey = function(tag) {
		if (tag.key && (!keys || keys[tag.key])) {
			data[tag.key] = _.cloneDeep(tag.vars);
		}

		_.each(tag.children, _getVarsBykey);
	}	

	_getVarsBykey(this);
	return data;
}

tag.clean = function() {
	const _clean = function(tag) {
		delete tag.parentTag;
		delete tag.attrList;
		delete tag.styleList;
		for (var i = 0; i < tag.children.length; i++) {
			_clean(tag.children[i]);
		}
	}

	_clean(this);

	return this;
}

function tagFactory(tagName) {
	var _tag = _.cloneDeep(tag);

	_tag.tagId = "tagId_" + (new Date()).getTime() + "_" + tagId++;
	_tag.tagName = tagName;
	_tag.varKey = _tag.tagId;

	return _tag;
}

export default tagFactory;
