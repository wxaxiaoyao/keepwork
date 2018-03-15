
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import tags from "../modeditor/tags.js";
import _const from "../../lib/const.js";

export default {
	data: function() {
		return  {
		}
	},

	props: {
		tag: {
			type:Object,
			default: function(){
				return tags.getTag(this.tagName || "div");
			},
		},
		styles:{
			type: Object,
			default: function() {
				return {
					//"background-color":"gray",
				};
			}
		},
		classes: {
			type: Object,
			default: function() {
				return {};
			}
		},
	},

	computed: {
		isEditorMode() {
			if (this.getMode != _const.EDITOR_MODE_EDITOR) {
				return false;
			}
			if (this.tag && this.currentTag && this.tag.tagId == this.currentTag.tagId) {
				return true;
			}

			return false;
		},
		...mapGetters({
			currentTag: 'getCurrentTag',
			getMode: "getMode",
		}),
	},

	methods: {
		...mapActions({
			setCurrentTag:'setCurrentTag',
		}),
		handleResult(payload) {
			console.log(payload, this);	
			this.tag.vars.text.text = payload;
		},
		mouseenter(){
			//console.log("--------mouseenter-----------");
			//this.styles["background-color"] = "blue";
		},
		mouseleave(){
			//console.log("--------mouseenter-----------");
			//this.styles["background-color"] = "gray";
		},
		click() {
			console.log("--------click---------");
			//console.log(this);
			this.setCurrentTag(this.tag);
		},
	},

	created() {
		//this.tag.setTagName(this.tagName);
		//this.tag.setVars(this.vars);
	},

	mounted() {
		var $parent = this.$parent;
		while($parent && !$parent.tag) {
			$parent = $parent.$parent;
		}

		if (!$parent) {
			return;
		}

		$parent.tag.addTag(this.tag);
	},

	beforeDestroy() {
		var $parent = this.$parent;
		while($parent && !parent.tag) {
			$parent = $parent.$parent;
		}
		if (!$parent) {
			return;
		}
		var $parent = this.$parent;
		$parent.tag.deleteTag(this.tag.tagId);
	},
}

