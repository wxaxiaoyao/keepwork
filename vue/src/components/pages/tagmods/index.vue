
<template>
	<el-container>
		<el-aside>
			<el-tabs type="border-card">
				<el-tab-pane label="导航">
					<tagNav :rootTag="rootTag"></tagNav>
					<tagEdit :rootTag="rootTag"></tagEdit>
				</el-tab-pane>
				<el-tab-pane label="模块">
					<mod-tree v-on:editModStyle="editModStyle"></mod-tree>
				</el-tab-pane>
				<el-tab-pane label="元素">
					<tagTree v-on:addTag="addTag"></tagTree>
				</el-tab-pane>
				<el-tab-pane label="导出">
					<el-form label-position="left" :model="mod">
						<el-form-item label="名称">
							<el-input v-model="mod.modName"></el-input>
						</el-form-item>
						<el-form-item label="样式">
							<el-input v-model="mod.styleName"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button @click="submitMod(mod)">提交</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</el-aside>
		<el-main>
			<div class="tagContainer">
				<tag :tag="rootTag"></tag>
			</div>
		</el-main>
	</el-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import modTree from "./modTree.vue";
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
			mod: {},
		}
	},

	computed: {
		...mapGetters({
			tagId: "getTagId",
			getTagMod: "mods/tagMod",
		}),
	},

	watch: {
		tagId: function(tagId) {
			this.tag = this.rootTag.findById(tagId);
		},
	},

	methods: {
		...mapActions({
			setTagMod:"mods/setTagMod",
			setMode: "setMode",
			submitTagMods: "mods/submitSystemMods",
		}),
		editModStyle(style){
			this.mod.modName = style.modName;
			this.mod.styleName = style.styleName;
			this.rootTag = tags.getTagByTag(style.tag);
		},
		addTag(tag){
			this.tag.addTag(tags.getTag(tag.type));
		},
		submitMod(mod) {
			if (!mod.modName || !mod.styleName) {
				return;
			}
			var tagMod = _.cloneDeep(this.getTagMod(mod.modName));
			tagMod.modName = mod.modName;
			tagMod.styles = tagMod.styles || {};
			tagMod.styles[mod.styleName] = {
				modName: mod.modName,
				styleName: mod.styleName,
				tag: _.cloneDeep(this.rootTag).clean(),
			}
			this.setTagMod(tagMod);
			this.$message("模块提交成功");
		},
	},

	components: {
		modTree,
		tagNav,
		tagEdit,
		tagTree,
	},

	created() {
		this.setMode("editor");
	}
}
</script>

<style>
.tagContainer {
	height: 600px;
	cursor: pointer;
	border: 4px solid gray;
}
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
