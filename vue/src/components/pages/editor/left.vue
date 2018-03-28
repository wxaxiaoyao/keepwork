<template>
	<el-tabs class="left-el-tabs" type="border-card" tab-position="left">
		<el-tab-pane label="文件">
			<fileTree></fileTree>
		</el-tab-pane>	
		<el-tab-pane label="编辑">
			<el-tabs type="border-card">
				<el-tab-pane label="导航">
					<tagNav :rootTag="rootTag"></tagNav>
				</el-tab-pane>
				<el-tab-pane label="元素">
					<tagTree v-on:addTag="addTag"></tagTree>
				</el-tab-pane>
				<el-tab-pane label="编辑">
					<tagEdit :rootTag="rootTag"></tagEdit>
				</el-tab-pane>
			</el-tabs>
		</el-tab-pane>	
	</el-tabs>
</template>

<script>
import tagTree from "./tagTree.vue";
import tagNav from "./tagNav.vue";
import tagEdit from "./tagEdit.vue";
import fileTree from "./fileTree.vue";

export default {
	props: ["rootTag"],
	components: {
		fileTree,
		tagTree,
		tagNav,
		tagEdit,
	},
	methods: {
		addTag(tag){
			this.$emit("addTag", tag);
		},
	},
}
</script>

<style>
.el-tabs, .el-tab-pane {
	height:100%;
}
.left-el-tabs .el-tabs__content {
	height:100%;
	padding:0px;
}
.left-el-tabs .el-tabs__header.is-left {
	margin-right:0px;
}
</style>
