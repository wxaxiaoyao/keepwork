
import _ from "lodash";

export default {
	props: {
		//vars: {
			//type:Object,
			//default: function(){
				//return {};
			//},
		//},
	},
	created(){
		if (!this.$parent || !this.$parent.tag) {
			return;
		}
		var tag = this.$parent.tag;

		if (this.tagName) {
			tag.setTagName(this.tagName);
		}

		if (this.vars && !tag.getVars()) {
			tag.setVars(this.vars);
		}
	}
}
