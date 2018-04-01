<template>
	<el-tree :data="tagTree" :props="tagTreeProps" @node-click="clickSelectTag"></el-tree>
</template>

<script>

import tagTree from "./tagTree.js";

export default {
	name:"tagTree",
	data:function() {
		return {
			tagTreeProps:{
				children:"children",
				label:"label",
			},
		}
	},

	props: {
		tagTree: {
			type:Array,
			default: function() {
				return tagTree;
			}
		}
	},

	methods: {
		clickSelectTag(tag) {
			if (!tag.type) {
				return;
			}
			this.$emit("addTag", tag);
		}
	}
}
</script>
