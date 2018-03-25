<template>
	<el-container>
		<el-aside width="20%">
			<left :rootTag="rootTag" v-on:addTag="addTag"></left>
			<!--<tagTree v-on:addTag="addTag"></tagTree>-->
		</el-aside>
		<el-container>
			<div class="split-strip"></div>
			<el-aside width="50%">
				<codemirror ref="codemirror" :value="value" @change="change" @cursorActivity="cursorActivity"></codemirror>
			</el-aside>
			<div class="split-strip"></div>
			<el-main>
				<tag :tag="rootTag"></tag>
			</el-main>
		</el-container>
				<!--<tagNav :rootTag="rootTag" :tag="tag" v-on:selectTag="selectTag"></tagNav>-->
				<!--<tagEdit :tag="tag"></tagEdit>-->
	</el-container>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import components from "../../../components/index.js";
import codemirror from "../../bases/codemirror.vue";
import markdown from "../../../lib/markdown/index.js";

import left from "./left.vue";
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
			value:undefined,
			cmOptions: {
			},
			markdown: markdown(),
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
		codemirror() {
			return this.$refs.codemirror.codemirror;
		},
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
		change(val) {
			this.render(val.text);
		},
		cursorActivity(pos) {
			console.log(pos);
		},
		render(text) {
			var self = this;
			var blocklist = this.markdown.parse(text);
			var tag = tags.getTag("div");
			blocklist.forEach(function(block, index){
				var tagName = "wiki-md";
				var subtag = undefined;
				if (block.isMod) {
					tagName = block.modName;
					if (block.modParams && block.modParams.tag) {
						subtag = block.modParams.tag;
					} else if(components[tagName]){
						subtag = tags.getTag(tagName);
						subtag.attrs.params = {
							params: block.modParams,
							$data: {
								attrName:":params",
								key:".params",
							}
						}
					}
				} else {
					subtag = tags.wikiMdTag(block.text);;
				}
				tag.addTag(subtag);
			});
			self.rootTag = tag;
			
		},
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
		//console.log(this.$refs.codemirror);

		var self = this;
	},
	created(){
	},

	components: {
		codemirror,
		left,
		tagNav,
		tagEdit,
		tagTree,
	},
}
</script>

<style>
html,body, .el-container, .el-aside, .el-row, .el-col {
	height:100%;
}
html, body {
	margin: 0px;
}
.vue-codemirror {
	height:100%;
}
.el-container, .el-aside {
	overflow-y: hidden;
}


#editorContainer {
	height:100%;
}

.split-strip {
	height:100%;
	width: 5px;
	background-color:rgb(168,168,168);
	cursor: col-resize;
}
.CodeMirrorFold {
	background-color: #F5F5F5;
}
.CodeMirror-vscrollbar {
	overflow-y: hidden;
}
</style>
