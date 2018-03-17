
import vue from "vue";
import tags from "../modeditor/tags.js";

export default {
	name: "tag",
	data: function() {
		return {
		}
	},
	props:{
		tag: {
			type:Object,
		},
		tagName: {
			type:String,
			//default:"div",
		},
	},

	computed: {
		compStyle() {
			return this.tag.styles;
		},
		compClass() {
			return this.tag.classes;
		},
		compileTemplate() {
			var tagName = this.tagName || this.tag.attrs.tagName || "div";
			var template = '<' + tagName + ' :style="compStyle" :class="compClass"><component v-for="x in tag.children" :tag="x" :is="x.tagName" :style="x.styles" :class="x.classes"></component></' + tagName + '>';
			return vue.compile(template);
		},
	},

	render(arg1, arg2, arg3, arg4) {
		var res = this.compileTemplate;
		this.compileRender = res.render;

		return this.compileRender(arg1,arg2,arg3,arg4);
	}, 
	staticRenderFns(createElement) {
		var res = this.compileTemplate;
		this.compileStaticRenderFns = res.staticRenderFns;

		return this.compileStaticRenderFns(arg1,arg2,arg3,arg4);
	},
	
	methods: {
	},
	created(){
		var vnodes = this.$slots.default || [];
		for (var i = 0; i < vnodes.length; i++) {
			this.tag.addTag(tags.getTagByVNode(vnodes[i]));
		}
	}
}
