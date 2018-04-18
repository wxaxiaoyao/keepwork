<template>
	<tag :tag="rootTag" class="markdown-body"></tag>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import tag from "@/components/common/tag.js";
import {tags} from "@/lib/tags";
import md from "@/lib/markdown";


export default {	
	name: "page",

	components:{
		tag,
	},

	data: function() {
		const roottag = tags.getTag();
		roottag.classes["container"] = true;
		return {
			rootTag: roottag,
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
				tag = tags.htmlTag(md.render(block.text));
			}

			return tag || tags.getTag();
		},
		getTemplateTag(template) {
			template = template || {};
			const modName = "template";
			const styleName = template.styleName || "default";
			const mod = this.getTagMod(modName);
			if (!mod || !mod.styles || !mod.styles[styleName]){
				return tags.getTag();;
			}
			const modStyle = mod.styles[styleName];
			//console.log(mod, styleName, modStyle.tag);
			return tags.getTagByTag(modStyle.tag);
		},
		getMainTag() {
			return this.rootTag.getTagByKey("main") || this.rootTag;
		},
		parseText(text) {
			const self = this;
			var subtag = undefined, tmpTag = undefined;
			var blocklist = md.parse(text);
			if (md.template.isChange) {
				self.rootTag = self.getTemplateTag(md.template);
			}
			var tag = self.getMainTag();
			if (this.mainTagId != tag.tagId) {
				this.blocklist = [];
				this.mainTagId = tag.tagId;
			}
			//console.log(tag);
			for (var i = 0; i < blocklist.length; i++) {
				var block = blocklist[i];
				var oldblock = this.blocklist[i];
				
				if (block.isTemplate) {
					tag.setChildrenTag(i, tags.getTag());
				} else if (!oldblock || oldblock.isMod != block.isMod) {
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
					tag.children[i].vars.text = md.render(block.text);
				}
			}
			var size = this.blocklist.length;
			for (var i = blocklist.length; i < size; i++) {
				this.blocklist.pop();
				tag.children.pop();
			}
			
			//console.log(tag.children, this.blocklist, blocklist, text);
		},
	},

	created() {
		this.blocklist = [];
	},

	mounted(){
		this.text && this.parseText(this.text);
	},

}

</script>
