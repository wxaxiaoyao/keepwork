import _ from "lodash";
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import tags from "../modeditor/tags.js";
import _const from "../../lib/const.js";
import tagContainer from "./tagContainer.vue";

import mods from "../index.js";

export default {
	name: "tag",
	data: function() {
		return {
		}
	},
	props:{
		tag: {
			type:Object,
			default: function() {
				return tags.getTag("div");
			}
		},
		tagName: {
			type:String,
			default:"div",
		},
	},

	watch:{
	},
	
	inheritAttrs: false,
	computed: {
		...mapGetters({
			mode: "getMode",
		}),
		attrStr(){
			return this.tag.getAttrsHtml(this.tagName);
		},
		compileTemplate() {
			var tagName = this.tagName;
			var attrStr = this.attrStr;
			var template = '<' + tagName + attrStr + ' v-bind="$attrs" v-on="$listeners">{{tag.text ||""}}<tag v-for="x in tag.children" :tag="x" :tagName="x.tagName"></tag></' + tagName + '>';
			if (tagName == "img" || tagName == "br" || tagName == "input") {
				template = '<' + tagName + attrStr + '/>';
			}
			//console.log(this.tag.styles, this.tag.classes, this.tag.attrs, this.tag.vars);
			if (this.mode == _const.EDITOR_MODE_EDITOR) {
				template = "<tagContainer :tag='tag'>" + template + "</tagContainer>";
			}
			console.log(template);
			return vue.compile(template);
		},
	},

	render(arg1, arg2, arg3, arg4) {
		var res = this.compileTemplate;
		this.compileRender = res.render;

		return this.compileRender(arg1,arg2,arg3,arg4);
	}, 
	staticRenderFns(arg1, arg2, arg3, arg4) {
		var res = this.compileTemplate;
		this.compileStaticRenderFns = res.staticRenderFns;

		return this.compileStaticRenderFns(arg1,arg2,arg3,arg4);
	},
	
	methods: {
	},
	created(){
		var self = this;
		var tag = this.tag;
		var subtag = undefined;
		var vnodes = this.$slots.default || [];
		tag.setTagName(this.tagName);
		console.log(vnodes, tag.tagId);
	
		var _vnodeToTag = function(tag, vnodes) {
			if (!vnodes) {
				return;
			}
			for (var i = 0; i < vnodes.length; i++) {
				var vnode = vnodes[i];
				var options = vnode.componentOptions;

				if (!options) {
					tag.text = vnode.text;
					//var subtag = tags.spanTag(vnode.text);
					//subtag.isVnode = true;
					//tag.addTag(subtag);
					continue;
				}

				var tagName = options.tag;
				var subtag = tags.getTag(tagName);
				_.merge(subtag.attrs, options.propsData);					
				if (vnode.data && vnode.data.attrs) {
					_.merge(subtag.attrs, vnode.data.attrs);					
				}
				subtag.isVnode = true;
				tag.addTag(subtag);

				_vnodeToTag(subtag, options.children);
			}
		}

		if (!tag.isVnode) {
			_vnodeToTag(tag, vnodes);
		}
	},
	components: {
		tagContainer,
		...mods,
	},
}
