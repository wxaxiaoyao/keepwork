<template>
	<tag :tag="rootTag" class="markdown-body"></tag>
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
			tagMods: "mods/tagMods",
		}),
	},

	watch: {
		text: function(text) {
			this.parseText(text);
			//var self = this;
			//self.renderTimer  && clearTimeout(self.renderTimer);
			//self.renderTimer = setTimeout(function() {
			//	self.parseText(text);
			//	self.renderTimer = undefined;
			//}, 1000);
		},
		tagMods: function() {
			this.parseText(this.text);
		},
	},

	methods: {
		getTagByBlock(block) {
			var tag = undefined;
			if (block.isMod) {
				var mod = this.getTagMod(block.modName);
				if (!mod || !mod.styles || !mod.styles[block.styleName]){
					return tags.getTag();
				}
				var modStyle = mod.styles[block.styleName];
				var tag = modStyle.tag;
				tag = tags.getTagByTag(tag);
				tag && tag.setVarsByKey(block.modParams);
			} else {
				tag = tags.wikiMdTag(block.text);
			}

			return tag || tags.getTag();
		},
		parseText(text) {
			var tag = this.rootTag;
			var subtag = undefined, tmpTag = undefined;
			var blocklist = md.parse(text);
			//console.log(blocklist);
			for (var i = 0; i < blocklist.length; i++) {
				var block = blocklist[i];
				var oldblock = this.blocklist[i];
			
				if (!oldblock || oldblock.isMod != block.isMod) {
					this.blocklist[i] = _.cloneDeep(block);
					subtag = this.getTagByBlock(block);
					subtag && tag.setChildrenTag(i, subtag);
					this.blocklist[i].tag = subtag;
				} else if (oldblock.isMod) {
					//console.log(oldblock);
					if (oldblock.modName == block.modName && tag.children[i].tagName == block.modName) {
						// 更新数据
						tag.children[i].setVarsByKey(block.modParams);
					} else {
						// 重新构造tag
						subtag = this.getTagByBlock(block);
						subtag && tag.setChildrenTag(i, subtag);
					}
				} else {
					tag.children[i].vars = tag.children[i].vars || {};
					tag.children[i].vars.text = block.text;
				}
			}
			for (var i = blocklist.length; i < this.blocklist.length; i++) {
				this.blocklist.pop();
				tag.children.pop();
			}
			//console.log(tag.children, this.blocklist);
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
