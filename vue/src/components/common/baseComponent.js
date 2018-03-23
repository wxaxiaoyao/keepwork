
import _ from "lodash";

export default {
	data: function() {
		return {
		}
	},
	props: {
		tag: {
			type:Object,
		},
	},
	watch: {
		"tag.vars": function(val) {
			this.vars = val;
		}
	},
	created(){
		if (!this.tag) {
			return;
		}
		var tag = this.tag;

		if (this.vars) {
			console.log(this.vars, tag.vars);
			tag.vars = _.merge(this.vars, tag.vars || {});
		} 

		//if (this.styles) {
			//tag.styles = Object.assign(this.styles, tag.styles || {});
		//}

		//if (this.classes) {
			//tag.classes = Object.assign(this.classes, tag.classes || {});
		//}
	}
}
