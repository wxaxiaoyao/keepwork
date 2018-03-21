
import _ from "lodash";

export default {
	props: {
		vars: {
			type:Object,
			default: function(){
				return {
				};
			},
		},
		styles: {
			type:Object,
			default: function(){
				return {};
			},
		},
		classes: {
			type:null,
			default: function(){
				return {};
			},
		},
	},
	created(){
		if (!this.$parent || !this.$parent.tag) {
			return;
		}
		var tag = this.$parent.tag;

		tag.vars = Object.assign(this.vars, tag.vars || {});
		tag.styles = Object.assign(this.styles, tag.styles);
		//tag.classes = Object.assign(this.classes, tag.classes);
	}
}
