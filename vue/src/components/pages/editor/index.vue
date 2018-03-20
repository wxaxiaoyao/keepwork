<template>
	<el-row>
		<el-col :span="4">
			<el-tree :data="tagTree" :props="tagTreeProps" @node-click="clickAddTag"></el-tree>
		</el-col>
		<el-col :span="16">
			<tag :tag="rootTag"><wikiText></wikiText></tag>
		</el-col>
		<el-col :span="4">
			<tagNav :tag="tag" v-on:selectTag="selectTag"></tagNav>
			<tagEdit :tag="tag"></tagEdit>
		</el-col>
	</el-row>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import tagList from "./tagList.vue";
import tagNav from "./tagNav.vue";
import tagEdit from "./tagEdit.vue";
import tagTree from "./tagTree.js";

import tags from "../../modeditor/tags.js";

export default {
	name:"editor",
	data: function() {
		var tag = tags.getTag("colDiv");
		return {
			value:true,
			mode:"editor",
			text:"",
			theme:"",
			tag:null,
			rootTag:tag,
			tagTree:tagTree,
			tagTreeProps:{
				children:"children",
				label:"label",
			},
		}
	},
	computed: {
		...mapGetters({
			tagId: 'getTagId',
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
	watch:{
		tagId:function(tagId) {
			this.tag = this.rootTag.findById(tagId);
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
		}),
		clickAddTag(tag, node, nodeComp) {
			if (!tag.type) {
				return;
			}
			this.tag.addTag(tags.getTag(tag.type));	
		},
		selectTag(tag) {
			this.tag = tag;
			tag && this.setTagId(tag.tagId);
		},
		blur() {
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
		this.rootTag.styles["min-height"]="40px";
		this.selectTag(this.rootTag);
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
</style>
