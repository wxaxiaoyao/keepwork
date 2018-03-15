
<template>
	<div :style="tag.styles">
		<slot></slot>
		<component v-for="x in tag.children" v-if="!isExist(x)" :tag="x" :is="x.tagName"></component>
	</div>
</template>

<script>
import tags from "../modeditor/tags.js";

export default {
	name: "wikiContainer",
	props:["tag"],
	data: function() {
		return {
			tagName:"wiki-container",
		}
	},
	methods: {
		isExist(x) {
			for (var i = 0; i < this.$children.length; i++) {
				var child = this.$children[i];
				if (child.tag && child.tag.tagId == x.tagId) {
					return true;
				}
			}

			return false;
		}
	}
}
</script>
