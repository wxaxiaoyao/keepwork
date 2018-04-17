<template>
	<div 
		@blur="blur"
		@focus="focus"
		@keyup="keyup"
		@keyup.enter="enter"
		@keyup.delete="_delete" 
		style="-webkit-user-modify:read-write-plaintext-only;
			   -webkit-line-break: normal;
			   -webkit-tap-highlight-color:rgba(0,0,0,0);
			   outline:none;">
		<component :is="tagHtml" :params="tagParams"></component>
	</div>
</template>


<script>
import vue from "vue";
import markdown from "../../lib/markdown/markdown.js";
import tags from "../modeditor/tags.js";

var md = markdown();

export default {
	name:"wikiMarkdown",
	data:function() {
		return {
		};
	},
	computed: {
		tagHtml: function() {
			var tagHtmlStr = this.rootTag.html();
			console.log(tagHtmlStr);
			var res = vue.compile(tagHtmlStr);
			return {
				props:['params'],
				created(){
					//console.log(this);
				},
				render: res.render,
				staticRenderFns: res.staticRenderFns,
			}
		},
		tagParams() {
			var params = this.rootTag.getParams();
			//console.log(params);
			return params;
		},
	},
	//props:["params"],
	props:{
		rootTag:{
			type:Object,
			default: function() {
				var rootTag = tags.getTag("colDiv");
				rootTag.addTag(tags.getTag("text"));
				return rootTag;
			},
		},
		tag:{
			type:Object,
	   	},
	},
	watch:{
	},
	methods: {
		focus(){
			//console.log("--------focus---------------");
		},
		blur(){
			//console.log("--------blur----------------");
			//console.log(event.target.innerHTML);
			//this.params.text.text = event.target.innerHTML;
			console.log("------------");
			//global.objectEvent.dispatchEvent("innerHTMLChange",{event:event});
			this.tagRebuild();
		},
		keyup(){
			//console.log("----------keyup-------------");
			var rootTag = this.rootTag;
			var selobj = getSelection();
			//console.log(rootTag.tagId, selobj.focusNode.parentElement.id);
			//var tag = rootTag.findById(selobj.focusNode.parentElement.id);
		},
		enter(){
			var self = this;
			var rootTag = this.rootTag;
			var selobj = getSelection();
			console.log(rootTag.tagId, selobj.focusNode.parentElement.id);
			var tag = rootTag.findById(selobj.focusNode.parentElement.id);
			console.log(selobj, tag);
			if (!tag || !tag.parentTag) {
				rootTag.addTag(tags.getTag("text"));
				return;
			}
			tag.innerHtmlChange && tag.innerHtmlChange();
			var parentTag = tag.parentTag;
			var childTag = tags.getTag(tag.type);
			parentTag.addTag(childTag);
		},
		_delete(){
			this.tagRebuild();
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
	created(){
		console.log(this.rootTag);
	},
	mounted() {
	}
}
</script>

<style scoped>
</style>
