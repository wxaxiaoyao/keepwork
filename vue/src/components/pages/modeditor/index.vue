<template>
	<el-container>
		<el-aside>
			<el-tabs type="border-card">
				<el-tab-pane label="导航">
					<tagNav :rootTag="rootTag"></tagNav>
					<tagEdit :rootTag="rootTag"></tagEdit>
				</el-tab-pane>
				<el-tab-pane label="元素">
					<modTree v-on:selectMod="selectMod"></modTree>
				</el-tab-pane>
			</el-tabs>
		</el-aside>
		<el-main>
			<el-row class="preview-row">
				<el-button @click="clickSaveBtn">保存</el-button>
				<el-col :span="18">
					<tag :tag="rootTag"></tag>
				</el-col>
				<el-col :span="6">
					<label>样式</label>
					<codemirror ref="cmstyle" :options="cmOptions"  @input="styleCodeChange"></codemirror>
					<label>模板</label>
					<codemirror ref="cmtemplate" :options="cmOptions" @input="templateCodeChange"></codemirror>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {codemirror} from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import 'codemirror/mode/javascript/javascript.js';

import {tags} from "@/lib/tags";
import tagNav from "../editor/tagNav.vue";
import tagEdit from "../editor/tagEdit.vue";
import modTree from "./modTree.vue";
import adi from "../../bases/adi.js";

export default {
	data: function() {
		return {
			rootTag:tags.getTag("div"),
			styleCode:"",
			templateCode:"",
			cmOptions: {
				lineNumbers: true,
				mode:"text/javascript",
				theme:"default",
			},
	   	};
	},

	components: {
		codemirror,
		tagNav,
		tagEdit,
		modTree,
	},

	computed: {
		...mapGetters({
			theme: 'theme',
			tagId: 'getTagId',
		}),
	},

	watch: {
		theme: function(theme) {
			adi.setTheme(theme);
		},
		rootTag: {
			handler: function(val) {
				var templateStyle = adi.toTemplateStyle() || {};
				this.templateCode = templateStyle.template || "{}";
				this.styleCode = templateStyle.style || "{}";

				var codemirror = this.$refs.cmstyle.codemirror;
				var cursor = codemirror.getCursor();
				codemirror.setValue(this.styleCode);
				codemirror.setCursor(cursor);
				codemirror = this.$refs.cmtemplate.codemirror;
				cursor = codemirror.getCursor();
				codemirror.setValue(this.templateCode);
				codemirror.setCursor(cursor);
			},
			deep:true,
		},	
	},

	methods:{
		...mapActions({
			setMode: "setMode",
			loadSystemMods: "mods/loadSystemMods",
			submitTagMods: "mods/submitTagMods",
			setTagMod: "mods/setTagMod",
		}),
		clickSaveBtn() {
			var tag = _.cloneDeep(this.rootTag);

			var mod = {
				name:"title",
				type:"tag",
				tag: tag.clean(),
			};
			this.setTagMod(mod);
			this.submitTagMods();
		},
		initCodeMirror() {
			var codemirror = this.$refs.cmstyle.codemirror;
			codemirror.setSize("100%", "100%");
			codemirror.setValue("{}");

			codemirror = this.$refs.cmtemplate.codemirror;
			codemirror.setSize("100%", "100%");
			codemirror.setValue("{}");
		},
		styleCodeChange(text) {
			if (this.styleCode != text) {
				adi.loadTemplateStyle(this.templateCode, text);
				var tag = adi.getTag();
				this.rootTag = tag ? tag : this.rootTag;
			}
		},
		templateCodeChange(text){
			if (this.templateCode != text) {
				adi.loadTemplateStyle(text, this.styleCode);
				var tag = adi.getTag();
				this.rootTag = tag ? tag : this.rootTag;
			}
		},
		selectMod(data) {
			adi.setMod(data.mod, data.modData);
			this.rootTag = adi.getTag();
		},
	},

	mounted() {
		//this.loadSystemMods();
		this.setMode("editor");
		this.initCodeMirror();

		adi.setTheme(this.theme);
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
