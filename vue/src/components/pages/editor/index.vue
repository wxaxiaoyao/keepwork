<template>
	<el-container 
		@mouseup.native="splitStripMouseup"
		@mousemove.native="splitStripMousemove"
		@mouseleave.native="splitStripMouseup">
		<el-aside ref="splitStrip1" :width="splitStrip1_width">
			<left :rootTag="rootTag" v-on:addTag="addTag"></left>
			<!--<tagTree v-on:addTag="addTag"></tagTree>-->
		</el-aside>
		<el-container ref="splitStrip1R">
			<div class="split-strip kp_forbit_copy" @mousedown="splitStripMousedown('splitStrip1')"></div>
			<el-aside ref="splitStrip2" :width="splitStrip2_width">
				<code-editor ref="codemirror"></code-editor>
			</el-aside>
			<div class="split-strip kp_forbit_copy" @mousedown="splitStripMousedown('splitStrip2')"></div>
			<el-main ref="splitStrip2R">
				<markdown :text="pageContent"></markdown>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import {Base64} from "js-base64";

import {tags} from "@/lib/tags";
import components from "../../../components/index.js";
import markdown from "../../bases/markdown.vue";
import left from "./left.vue";
import codeEditor from "./codeEditor.vue";
import adi from "../../bases/adi.js";

export default {
	name:"editor",
	data: function() {
		var tag = tags.getTag("div");
		return {
			splitStrip1_width:"18%",
			splitStrip2_width:"50%",
			value:undefined,
			mode:"editor",
			text:"",
			tag:tag,
			rootTag:tag,
		}
	},
	computed: {
		...mapGetters({
			theme: 'theme',
			tagId: 'getTagId',
			pageContent: 'getPageContent',
			getTagMod: "mods/tagMod",
		}),
		codemirror() {
			return this.$refs.codemirror.codemirror;
		},
		tagParams() {
			return this.rootTag.getParams();
		},

	},
	watch:{
		theme: function(theme) {
			adi.setTheme(theme);
		},
		tagId:function(tagId) {
			var tag = this.rootTag.findById(tagId);
			if (tag) {
				this.tag = tag;
			}
		},
		pageContent:function(text) {
			this.render(text);
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
			setFile: 'gitlab/setFile',
		}),
		splitStripMousedown(typ) {
			var el = this.$refs[typ].$el;
			this.splitStrip = {
				el: el,
				rel: this.$refs[typ+"R"].$el,
				parentEl: el.parentElement,
				typ: typ,
				key: typ + "_width",
				startX: event.clientX,
				leftWidth: el.offsetWidth,
			};
			//console.log(event, typ, this.splitStrip);
		},
		splitStripMousemove() {
			if (!this.splitStrip) {
				return;
			}

			// 移动的时候显示
			this.splitStrip.el.style.display = "";

			let key = this.splitStrip.key;
			let startX = this.splitStrip.startX;
			let leftWidth = this.splitStrip.leftWidth;
			let newLeftWidth = leftWidth + event.clientX - startX;
			let parentWidth = this.splitStrip.parentEl.offsetWidth;
			if (parentWidth - newLeftWidth > 50) {
				this.splitStrip.rel.style.display = "";
			}

			if (this.splitStrip.typ == "splitStrip1" && newLeftWidth > 500) {
				newLeftWidth = 500;
			}
			
			this[key] = newLeftWidth + "px";
			this.splitStrip.newLeftWidth = newLeftWidth;
		},
		splitStripMouseup() {
			if (!this.splitStrip) {
				return;
			}
			const minWidths = {"splitStrip1": 200, "splitStrip2": 300};
			let key = this.splitStrip.typ + "_width";
			let minWidth = minWidths[this.splitStrip.typ];
			let newLeftWidth = this.splitStrip.newLeftWidth;
			let parentWidth = this.splitStrip.parentEl.offsetWidth;
			
			this[key] = newLeftWidth + "px";

			if (newLeftWidth < minWidth) {
				this.splitStrip.el.style.display = "none";
				this[key] = "0px";
			}

			if ((parentWidth - newLeftWidth) < minWidth) {
				this[key] = parentWidth - 10 + "px";
				this.splitStrip.rel.style.display = "none";
			}

			this.splitStrip = undefined;
		},
		render(text) {
			this.text = this.pageContent;
		},
		addTag(tag, node, nodeComp) {
			this.mode = "test";
			if (!tag.type) {
				return;
			}
			const subTag = tags.getTag(tag.type);
			if (tag.type.indexOf("Adi") == 0){
				subTag.vars = adi.getComponentProperties(tag.type);
			}
			this.tag.addTag(subTag);	
		},
		selectTag(tag) {
			this.tag = tag;
			tag && this.setTagId(tag.tagId);
		},
	},
	mounted() {
		adi.setTheme(this.theme);
		this.selectTag(this.rootTag);
	},
	beforeMount() {
	},
	created(){
	},

	components: {
		left,
		codeEditor,
		markdown,
	},
}
</script>

<style>
html,body, .el-container, .el-aside {
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
