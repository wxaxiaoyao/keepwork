<template>
	<tag :tag="rootTag"></tag>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import tag from "../common/tag.js";

import wikiMd from "./wikiMd.vue";

import tags from "../modeditor/tags.js";
import markdown from "../../lib/markdown/index.js";

const md = markdown();

export default {	
	name: "markdown",

	data: function() {
		return {
			rootTag: tags.getTag(),
		};
	},

	props: {
		text: {
			type:String,
		},
	},

	computed: {
		...mapGetters({
			getTagMod: "mods/tagMod",
		}),
	},

	watch: {
		text: function(text) {
			this.parseText(text);
		},
	},

	methods: {
		getTagByBlock(block) {
			var tag = undefined;
			if (block.isMod) {
				tag = (this.getTagMod(block.modName) || {}).tag;
				tag = tags.getTagByTag(tag);
			} else {
				tag = tags.wikiMdTag(block.text);
			}

			return tag;
		},
		parseText(text) {
			var tag = this.rootTag;
			var subtag = undefined, tmpTag = undefined;
			var blocklist = md.parse(text);
			for (var i = 0; i < blocklist.length; i++) {
				var block = blocklist[i];
				var oldblock = this.blocklist[i];
				if (!oldblock || oldblock.isMod != block.isMod) {
					this.blocklist[i] = _.cloneDeep(block);
					subtag = this.getTagByBlock(block);
					subtag && tag.setChildrenTag(i, subtag);
				} else if (oldblock.isMod) {

				} else {
					tag.children[i].vars.text = block.text;
				}
			}
			for (var i = blocklist.length; i < this.blocklist.length; i++) {
				this.blocklist.pop();
				tag.children.pop();
			}
		},
	},

	created() {
		this.blocklist = [];
	},

	mounted(){
		this.text && this.parseText(this.text);
	},

	components:{
		wikiMd,
	}
}

</script>
