<template>
	<el-row>
		<el-col :span="4">
			<tagTree v-on:addTag="addTag"></tagTree>
		</el-col>
		<el-col :span="16">
			<tag :tag="rootTag"></tag>
		</el-col>
		<el-col :span="4">
			<tagNav :rootTag="rootTag" :tag="tag" v-on:selectTag="selectTag"></tagNav>
			<tagEdit :tag="tag"></tagEdit>
		</el-col>
	</el-row>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import tagNav from "./tagNav.vue";
import tagEdit from "./tagEdit.vue";
import tagTree from "./tagTree.vue";

import tags from "../../modeditor/tags.js";
import adi from "../../bases/adi.js";

export default {
	name:"editor",
	data: function() {
		var tag = tags.getTag("div");
		//var tag = adi.setMod("ModTitle").getTag();
		return {
			value:true,
			mode:"editor",
			text:"",
			theme:"",
			tag:tag,
			rootTag:tag,
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
			var tag = this.rootTag.findById(tagId);
			if (tag) {
				this.tag = tag;
			}
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
		}),
		addTag(tag, node, nodeComp) {
			this.mode = "test";
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
		//this.rootTag.styles["min-height"]="40px";
		//console.log(this.rootTag);
		this.selectTag(this.rootTag);
	},
	created(){
	},

	components: {
		tagNav,
		tagEdit,
		tagTree,
	},
}
</script>

<style scoped>
.el-col {
	min-height: 1px;
}
</style>
