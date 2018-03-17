<template>
	<div :style="tag.styles" :class="tag.classes">
		<component v-for="x in tag.children" :tag="x" :is="x.tagName"></component>
	</div>
</template>

<script>
import tags from "../modeditor/tags.js";

export default {
	name: "wikiTag",
	data: function() {
		return {
			tagName:"wikiTag",
		}
	},
	props:{
		tag: {
			type:Object,
		},
	},
	inheritAttrs:false,
	methods: {
	},
	created(){
		var vnodes = this.$slots.default || [];
		for (var i = 0; i < vnodes.length; i++) {
			this.tag.addTag(tags.getTagByVNode(vnodes[i]));
		}
		console.log(this);
	}
}
</script>
