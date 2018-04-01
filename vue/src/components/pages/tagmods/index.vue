
<template>
	<el-container>
		<el-aside>
			<el-tabs type="border-card">
				<el-tab-pane label="导航">
					<tagNav :rootTag="rootTag"></tagNav>
					<tagEdit :rootTag="rootTag"></tagEdit>
				</el-tab-pane>
				<el-tab-pane label="元素">
					<tagTree v-on:addTag="addTag"></tagTree>
				</el-tab-pane>
			</el-tabs>
		</el-aside>
		<el-main>
			<tag :tag="rootTag"></tag>
		</el-main>
	</el-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import tagNav from "../editor/tagNav.vue";
import tagEdit from "../editor/tagEdit.vue";
import tagTree from "../editor/tagTree.vue";
import tags from "../../modeditor/tags.js";
export default {
	data: function() {
		const tag = tags.getTag();
		return {
			rootTag: tag,
			tag: tag,
		}
	},

	methods: {
		addTag(tag){
			this.tag.addTag(tags.getTag(tag.type));
		},
	},

	components: {
		tagNav,
		tagEdit,
		tagTree,
	},
}
</script>

<style>
html,body, .el-container, .el-main, .el-aside, .el-tabs, .el-tab-pane {
	height:100%;
	margin: 0px;
	padding: 0px;
	overflow-y: hidden;
}
.el-tabs--border-card>.el-tabs__content {
	height:100%;
	padding: 0px;	
}
.vue-codemirror{
	height:40%;
}
.el-col {
	height: 100%;
}
.preview-row {
	height:100%;
}
</style>
