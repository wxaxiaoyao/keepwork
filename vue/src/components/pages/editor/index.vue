<template>
	<el-row>
		<el-col :span="4">
			<tagList v-on:selectTag="clickAddTag"></tagList>
		</el-col>
		<el-col :span="16">
			<tag :tag="rootTag"><wikiText></wikiText></tag>
		</el-col>
		<el-col :span="4">
			<div>
				<el-tabs type="border-card">
					<el-tab-pane label="Tag导航">
						<tagNav></tagNav>
					</el-tab-pane>
				</el-tabs>
				<tagEdit></tagEdit>
			</div>
		</el-col>
	</el-row>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import tagList from "./tagList.vue";
import tagNav from "./tagNav.vue";
import tagEdit from "./tagEdit.vue";

import tags from "../../modeditor/tags.js";

export default {
	name:"editor",
	data: function() {
		var tag = tags.getTag("colDiv");
		return {
			mode:"editor",
			text:"",
			theme:"",
			rootTag:tag,
		}
	},
	computed: {
		...mapGetters({
			tag: 'getCurrentTag',
		}),
		tagHtml: function() {
			var tagHtmlStr = this.rootTag.html();
			//console.log(tagHtmlStr);
			var res = vue.compile(tagHtmlStr);
			return {
				//template: tagHtmlStr,
				props:['params'],
				created(){
					//console.log(this);
				},
				render: res.render,
				staticRenderFns: res.staticRenderFns,
			}
		},
		tagParams() {
			return this.rootTag.getParams();
		},
	},
	methods: {
		...mapActions({
			setCurrentTag:'setCurrentTag',
		}),
		clickAddTag(tag) {
			this.tag.addTag(tags.getTag(tag.type));	
		},
		blur() {
			console.log("----------", event);
			this.tagRebuild();
		},
		keyup(){
		},
		_delete(){
		},
		enter(){
			var self = this;
			var rootTag = this.rootTag;
			var selobj = getSelection();
			var tag = rootTag.findById(selobj.focusNode.parentElement.id);
			console.log(selobj);
			if (!tag || !tag.parentTag) {
				return;
			}
			var parentTag = tag.parentTag;
			var childTag = tags.getTag(tag.tagName);
			parentTag.addTag(childTag);

			//setTimeout(function(){
			//	self.tagRebuild();
			//});
		},
		mouseup(){
			//console.log(getSelection());
		},
		tagRebuild() {
			// 删除不存在的tag
			var rootTag = this.rootTag;
			var deleteNotExistTag = function(tag) {
				var list = [];
				for (var i = 0; i < tag.children.length; i++) {
					var _tag = tag.children[i];
					if (document.getElementById(_tag.tagId)) {
						list.push(_tag);
					}
				}
				tag.children = list;
				for (var i = 0; i < tag.children.length; i++){
					var _tag = tag.children[i];
					deleteNotExistTag(_tag);
				}
			}

			deleteNotExistTag(rootTag);

			// 更新tag内容
			rootTag.each(function(tag){
				tag.innerHtmlChange && tag.innerHtmlChange();
			});
		},
	},
	mounted() {
		this.setCurrentTag(this.rootTag);
	},
	created(){
	},

	components: {
		tagList,
		tagNav,
		tagEdit,
	},
}
</script>

<style scoped>
.el-col {
	min-height: 1px;
}

.hoverTag {
	background-color: #f0f0f0;
}

.activeTag {
	border: 1px solid red;
}

</style>
