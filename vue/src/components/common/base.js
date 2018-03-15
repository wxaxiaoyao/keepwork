
import _ from "lodash";

export default {
	created(){
		if (!this.$parent.tag) {
			return;
		}
		this.$parent.tag.setTagName(this.tagName);
		this.$parent.tag.setVars(this.vars);
		console.log(this.$parent.tag.vars === this.vars);
	}
}
