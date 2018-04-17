import vue from "vue";
import _ from "lodash";

import adiComponents from "../adi/common/index.js";
import adiComponentProps from "../adi/common/comp.properties.js";
import mods from "../adi/mod/index.js";
import {tags} from "@/lib/tags";

for (var key in adiComponents){
	//vue.component(key, adiComponents[key]);
	(function(key){
		vue.component(key, {
			props:{
				options: {
					type:Object,
					default: function() {
						return {};
					},
				},
			},
			extends:adiComponents[key],
		});
	})(key);
}

var adi = {
	mods:mods,
	tags:{},
};

function parseMod(m, template, root) {
	template = template || m.template;
	root = (root || 'root') + "Row";

	var tag = tags.getTag("elRow");
	m.setTag(tag, root);

	for(var i = 0; i < template.length; i++) {
		for (var key in template[i]) {
			var element = template[i][key];
			var tmpTag = tags.getTag("elCol");
			var comTag = undefined;
			var source = undefined;
			m.setTag(tmpTag, key);
			if (typeof(element) == "string") {
				comTag = tags.getTag(m.compType(element));
				m.setTag(comTag, element);
				comTag.vars = {
					source:m.modData[element] || {},
					options:m.getOptions(element) || {},
				}
				comTag.attrs[":source"] = tag.varsPrefix + ".source";
				comTag.attrs[":options"] = tag.varsPrefix + ".options";
			} else if(Array.isArray(element)) {
				comTag = parseMod(m, element, key);
			} else {
				continue;
			}
			tmpTag.addTag(comTag);
			tag.addTag(tmpTag);
		}
	}

	return tag;
}

adi.getComponentProperties = function(compName) {
	return adiComponentProps[compName] || {};
}

adi.setMod = function(mod, modData) {
	if (!mod) {
		return;
	}

	if (typeof(mod) == "string") {
		mod = mods[mod];
	}
	console.log(mod);

	this.mod = mod;
	this.modData = _.merge(_.cloneDeep(this.mod.properties), modData || {});

    var styleID = Number(this.modData.styleID) >= this.mod.styles.length ? this.mod.styles.length - 1 : Number(this.modData.styleID);
    this.style = this.mod.styles[styleID || 0];
    this.template = this.mod.templates[this.style.templateID || 0];

	this.tag = tags.getTag("div");
	this.setTag(this.tag, "root");
	this.tag.addTag(parseMod(this));

	return this;
}

adi.setTheme = function(theme) {
	this.theme = theme;
}

adi.loadTemplateStyle = function(template, style) {
	if (typeof(template) == "string") {
		try {
			template = JSON.parse(template);
		} catch(e) {
			return;
		}
	}
	if (typeof(style) == "string") {
		try {
			style = JSON.parse(style);
		} catch(e) {
			return;
		}
	}

	this.template = template;
	this.style = style;

	this.tag = tags.getTag("div");
	this.setTag(this.tag, "root");
	this.tag.addTag(parseMod(this));

	return this;
}

adi.getProps = function(name) {
	return (this.style.props && this.style.props[name]) || {};
}


adi.themeClass = function(name) {
	if (this.theme) return this.theme.sheet.classes[name];
}

adi.themeData = function(name) {
	if (this.theme) return this.theme.data[name];
}

adi.getClasses = function(name) {
	name = name || 'root';
	var classes = {};
	if (this.style.theme && this.style.theme[name]) {
		this.style.theme[name].forEach(el => classes[el] = true);
	}

	return classes;
}

adi.getOptions = function(name) {
	let options = {}

	if (this.style.options) {
		if (this.style.options.config[name]) {
			options = _.cloneDeep(this.style.options.config[name])
		}
	}
	if (this.style.options.theme[name]) {
		_.forEach(this.style.options.theme[name], (op, key) => {
			// 如果定义了相同的theme key，则之前的配置会被覆盖
			options[key] = this.themeData(op);
		})
	}

	return options;
}

adi.getStyles = function(name) {
	return this.style.data[name] || {};
}

adi.setTag = function(tag, name) {
	tag.aliasName = name;

	_.merge(tag.attrs, this.getProps(name));
	_.merge(tag.classes, this.getClasses(name));
	_.merge(tag.styles, this.getStyles(name));
}

adi.compType = function(name) {
	return this.mod.components[name];
}

adi.getTag = function() {
	return this.tag;
}

adi.toStyle = function() {
	
}

adi.toTemplateStyle = function() {
	if (!this.tag || this.tag.children.length != 1) {
		return;
	}
	var tag = this.tag.children[0];	
	var style = {data:{}, props:{}, options:{}, theme:{}}, template = {};

	style.data[this.tag.aliasName] = this.tag.styles;
	style.props[this.tag.aliasName] = this.tag.attrs;
	style.options = this.style.options; // 无法处理此选项
	style.theme = this.style.theme;

	function _toTemplate(tag, template) {
		var aliasName = tag.aliasName;

		style.data[aliasName] = tag.styles;
		style.props[aliasName] = tag.attrs;
		if (tag.tagName == "el-row") {
			aliasName = aliasName.replace(/Row$/, "");
			template[aliasName] = [];
			for (var i = 0; i < tag.children.length; i++) {
				var subTag = tag.children[i];
				var _template = {};
				_toTemplate(subTag, _template);
				template[aliasName].push(_template);
			}
		} else if (tag.tagName == "el-col"){
			// 列中只含一个元素
			var subTag = tag.children[0];
			if (subTag) {
				if (subTag.tagName != "el-row") {
					template[aliasName] = subTag.aliasName;
					style.data[subTag.aliasName] = subTag.styles;
					style.props[subTag.aliasName] = subTag.attrs;
				} else {
					_toTemplate(subTag, template);
				}
			}
		}
	}

	_toTemplate(tag, template);
	return {style:JSON.stringify(style, null, 2), template:JSON.stringify(template["root"], null, 2)};
}

export default adi;



