<template>
	<el-tabs type="border-card">
		<el-tab-pane label="元素列表">
			<el-tree :data="tagTree" :props="tagTreeProps" @node-click="clickSelectTag"></el-tree>
		</el-tab-pane>	
	</el-tabs>
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
			this.$emit("addTag", tag);
		}
	}
}
</script>
