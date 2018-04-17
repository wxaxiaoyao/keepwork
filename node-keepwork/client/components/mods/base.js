
import vue from "vue";

export default {
	props:{
		mod:{
			type:Object,
			default: function() {
				return {
					style:"default",
				}
			}
		},
	},

	computed: {
		compileTemplate() {
			const template = this.styles[this.mod.style];
			//console.log(template);
			return vue.compile(template);
		},
	},

	render(arg1, arg2, arg3, arg4) {
		var res = this.compileTemplate;
		this.compileRender = res.render;

		return this.compileRender(arg1, arg2, arg3, arg4);
	}, 

	staticRenderFns(arg1, arg2, arg3, arg4) {
		var res = this.compileTemplate;
		this.compileStaticRenderFns = res.staticRenderFns;

		return this.compileStaticRenderFns(arg1, arg2, arg3, arg4);
	},

	created() {
		//console.log(this);
	}
}
