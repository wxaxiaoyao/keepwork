<template>
	<div class="flex-container">
		<el-container>
			<el-aside>
				<el-tabs type="border-card" style="height:100%; border:none">
					<el-tab-pane label="元素">
						<tagTree v-on:addTag="addTag"></tagTree>
					</el-tab-pane>
					<el-tab-pane label="模块">
						<mod-tree v-on:editModStyle="editModStyle"></mod-tree>
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
			<el-container direction="vertical">
				<el-main class="border clearPadding" style="cursor:pointer;">
					<tag :tag="rootTag"></tag>
				</el-main>
				<el-container style="height:400px; flex:none">
					<el-aside class="border">
						<tagNav :rootTag="rootTag"></tagNav>
					</el-aside>
					<el-container>
						<tagEdit :rootTag="rootTag"></tagEdit>
					</el-container>
				</el-container>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	Button,
	Container,
	Header,
	Aside,
	Main,
	Footer,
	Form,
	FormItem,
	Input,
	Tabs,
	TabPane,
	Message,
} from "element-ui";
import {mapActions, mapGetters} from "vuex";
import {tags} from "@/lib/tags";
import "@/components/bases/index.js";
import "@/components/common/index.js";
//import adi from "@/components/bases/adi.js";
import modTree from "@/components/views/modTree.vue";
import tagNav from "@/components/views/tagNav.vue";
import tagEdit from "@/components/views/tagEdit.vue";
import tagTree from "@/components/views/tagTree.vue";
export default {
	components: {
		[Button.name]: Button,
		[Container.name]:Container,
		[Header.name]:Header,
		[Aside.name]:Aside,
		[Main.name]:Main,
		[Footer.name]:Footer,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Input.name]: Input,
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,

		modTree,
		tagNav,
		tagEdit,
		tagTree,
	},

	data: function() {
		const tag = tags.getTag();
		return {
			rootTag: tag,
			tag: tag,
			mod: {},
			isSubmitTagMods: false,
		}
	},

	computed: {
		...mapGetters({
			theme:"theme/theme",
			tagId: "editor/getTagId",
			getTagMod: "mods/tagMod",
			tagMods: "mods/tagMods",
		}),
	},

	watch: {
		tagId: function(tagId) {
			this.tag = this.rootTag.findById(tagId);
		},
		tagMods: {
			handler: function() {
				if (!this.isSubmitTagMods) {
					return;
				}
				var self = this;
				this.submitTagMods().then(function() {
					self.$message("模块提交成功");
				}).catch(function(){
					self.$message("模块提交失败");
				});
				this.isSubmitTagMods = false;
			},
			deep: true,
		},
	},

	methods: {
		...mapActions({
			setTagId:'editor/setTagId',
			setTagMod:"mods/setTagMod",
			setMode: "editor/setMode",
			loadTagMods: "mods/loadTagMods",
			submitTagMods: "mods/submitTagMods",
		}),
		editModStyle(style){
			this.mod.modName = style.modName;
			this.mod.styleName = style.styleName;
			this.rootTag = tags.getTagByTag(style.tag);
		},
		addTag(tag){
			const containerTag = this.tag.getContainerTag();
			let subtag = tags.getTag(tag.type);
			//if (tag.source == "AdiComponent"){
			//	subtag.vars = _.cloneDeep(adi.getComponentProperties(tag.type));
			//	subtag.attrs[":source"] = "tag.vars";
			//} else if (tag.source == "AdiMod") {
			//	subtag = adi.setMod(tag.type).getTag();
			//}
			containerTag && containerTag.addTag(subtag);
			this.setTagId(subtag.tagId);
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
			this.isSubmitTagMods = true;
		},
	},

	async created() {
		this.setMode("editor");
		//adi.setTheme(this.theme);
	},

	mounted() {
		this.setTagId(this.rootTag.tagId);
	}
}
</script>

<style>
html, body {
	height:100%;
	width:100%;
	margin: 0px;
	padding: 0px;
}
.flex-container {
	height:100%;
	width:100%;
	display: flex;
}
.mainContainer {
	display: flex;
	height: 100%;
	flex-direction: column;
}
.clearPadding {
	padding: 0px;
}
.border {
	border: 4px solid gray;
}
</style>
