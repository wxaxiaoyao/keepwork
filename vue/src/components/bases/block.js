import components from "../../components/index.js";

export default {
	props:{
		block:{
			type:Object,
			default: function() {
				return {
					html:"",
					text:"",
					modName:"",
					modParams: {

					}
				}
			}
		},
	},

	computed: {
		compileTemplate() {
			var modName = this.mod.modName;
			if (modName) {
				if (!components[modName]) {
					return vue.compile("<div>模块不存在</div>");
				}
			}
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
