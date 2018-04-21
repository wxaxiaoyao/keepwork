<template>
	<el-tabs class="left-el-tabs" type="border-card">
		<el-tab-pane label="文件">
			<fileTree></fileTree>
		</el-tab-pane>	
		<el-tab-pane label="模块">
			<modTree></modTree>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import {
	Tabs,
	TabPane,
	Message,
} from "element-ui";
import modTree from "./modTree.vue";
import tagTree from "./tagTree.vue";
import tagNav from "./tagNav.vue";
import tagEdit from "./tagEdit.vue";
import fileTree from "./fileTree.vue";

export default {
	components: {
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
		modTree,
		fileTree,
		tagTree,
		tagNav,
		tagEdit,
	},
	props: ["rootTag"],
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
