
import vue from "vue";
import tags from "../modeditor/tags.js";

export default {
	data: function() {
		return  {
		}
	},
	props: {
		kp_tag: {
			type:Object,
			default:function(){
				return tags.getTag("div");
			},
		},
	},

	mounted: function() {
		var $parent = this.$parent;
		while($parent && !parent.kp_tag) {
			$parent = $parent.$parent;
		}
		if (!$parent) {
			return;
		}

		$parent.kp_tag.addTag(this.kp_tag);
	},

	beforeDestroy() {
		var $parent = this.$parent;
		while($parent && !parent.kp_tag) {
			$parent = $parent.$parent;
		}
		if (!$parent) {
			return;
		}
		var $parent = this.$parent;
		$parent.kp_tag.deleteTag(this.kp_tag.tagId);
	},
}

