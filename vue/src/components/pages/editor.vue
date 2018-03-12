<template>
	<el-row>
		<el-col :span="4">
			<div class="tagsContainer"> 
				<div v-for="node in tagTree" :key="node.id">
					<div @click="clickExpandTag(node)" style="cursor:pointer">
						<span><i :class='node.isExpand ? "fa fa-chevron-down" : "fa fa-chevron-right"'></i></span>
						<span>{{node.classify}}</span>
					</div>
					<div v-show="node.isExpand" style="margin-left:20px">
						<div v-for="x in node.nodes" :key="x.id" class="tagContainer">
							<span style="width:100px">{{x.name || x.type}}</span>
							<span @click="clickAddTag(x)" style="cursor:pointer">+</span>
						</div>
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="16">
			<div ref="editor" 
				style="-webkit-user-modify: read-write-plaintext-only;
					   -webkit-line-break: normal;
					   -webkit-tap-highlight-color:rgba(0,0,0,0);
					   outline:none;"
				@keyup.enter="enter" 
				@keyup.delete="_delete" 
				@keyup="keyup" 
				@blur="blur" 
				@mouseup="mouseup">
					<component :is="tagHtml" :params="tagParams"></component>
			</div>
			<div>
				<markdown :mode="mode" :text="text" :blocklist="blocklist"></markdown>
			</div>
		</el-col>
		<el-col :span="4">
			<div>
				<el-tabs type="border-card">
					<el-tab-pane label="Tag导航">
						<div style="cursor:pointer">
							<span v-for="x in navTagList" :key="x.id" @click="clickSelectTag(x)">
								<i class="fa fa-chevron-right"></i>{{x.name || x.type}}
							</span>
						</div>
						<div v-for="(x, $index) in tag.children" :key="x.tagId" class="navTagSubItemContainer">
							<span @click="clickSelectTag(x)">
								{{x.name || x.type}}
							</span>
							<span @click.stop="clickDeleteTag($index)"><i class="fa fa-trash-o"></i></span>
							<span v-show="$index != 0" @click.stop="clickSwapTag($index - 1, $index)"><i class="fa fa-arrow-up"></i></span>
							<span v-show="$index != tag.children.length - 1" @click.stop="clickSwapTag($index, $index + 1)"><i class="fa fa-arrow-down"></i></span>
						</div>
					</el-tab-pane>
				</el-tabs>
				<el-tabs type="border-card">
					<el-tab-pane label="属性">
						<div class="attrInputContainer">
							<input type="text" style="width:30%" placeholder="属性" v-model="attrKey" @blur="attrKeyBlur()"/>
							<input type="text" style="width:60%" placeholder="值" v-model="attrValue" @blur="attrValueBlur()"/>
						</div>
						<div class="attrInputContainer">
							<span>标签名</span>
							<input type="text" placeholder="标签名" disabled v-model="tag.name"/>
						</div>
						<div class="attrInputContainer" v-for="x in tag.attrList" :key="x.id">
							<span>{{x.name || x.attrName}}</span>	
							<input type="text" :placeholder="x.desc || x.name || x.attrName" v-model="attrs[x.attrName]" @change="attrChange(x)"/>
						</div>
					</el-tab-pane>
					<el-tab-pane label="样式">
						<div class="attrInputContainer">
							<input type="text" style="width:30%" placeholder="样式属性" v-model="styleKey" @blur="styleKeyBlur()"/>
							<input type="text" style="width:60%" placeholder="值" v-model="styleValue" @blur="styleValueBlur()"/>
						</div>
						<div class="attrInputContainer">
							<span>背景色</span>
							<input type="text" placeholder="背景色[background-color]" v-model="style['background-color']"/>
						</div>
						<div class="attrInputContainer">
							<span>高度</span>
							<input type="text" placeholder="高度[height]" v-model="style['height']"/>
						</div>
						<div class="attrInputContainer">
							<span>宽度</span>
							<input type="text" placeholder="宽度[width]" v-model="style['width']"/>
						</div>
						<div class="attrInputContainer">
							<span>外边距</span>
							<input type="text" placeholder="外边距[margin]" v-model="style['margin']"/>
						</div>
						<div class="attrInputContainer">
							<span>内边距</span>
							<input type="text" placeholder="内边距[padding]" v-model="style['padding']"/>
						</div>
					</el-tab-pane>
					<el-tab-pane label="变量">
						<div v-for="(value, key) in tag.vars">
							<div class="attrInputContainer">
								<input type="text" :placeholder="key" v-model="value.text"/>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-col>
	</el-row>
</template>

<script>
import vue from "vue";
import markdown from '../markdown';
import tags from "../modeditor/tags.js";
import "../bases";
export default {
	name:"editor",
	data: function() {
		var tag = tags.getTag("colDiv");
		return {
			style:{},
			attrs:{},
			attrKey:"",
			attrValue:"",
			styleKey:"",
			styleValue:"",
			tagTree: tags.tagTree(),
			mode:"editor",
			text:"",
			theme:"",
			tag:tag,
			rootTag:tag,
			blocklist:[
			//{
			//	//id:1,
			//	modName:"test",
			//	cmdName:"test",
			//	modParams:{
			//		title:"hello world",
			//	},
			//	isWikiBlock:true,
			//	htmlContent: "<div>html content</div>",
			//},
			//{
			//	//id:1,
			//	modName:"test",
			//	cmdName:"test",
			//	modParams:{
			//		style:"style1",
			//		title:"hello world",
			//	},
			//	isWikiBlock:true,
			//	htmlContent: "<div>html content</div>",
			//},
			],
		}
	},
	computed: {
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
		navTagList(){
			var navTagList = [];
			var tmpTag = this.tag;
			while(tmpTag) {
				navTagList.push(tmpTag);
				tmpTag = tmpTag.parentTag;
			}
			navTagList.reverse();
			return navTagList;
		},
	},
	methods: {
		clickExpandTag(node){
			console.log(node);	
			vue.set(node, "isExpand", !node.isExpand);
		},
		clickSelectTag(tag) {
			this.tag = tag;
			this.attrs = tag.attrs;
			this.style = tag.attrs.style;
		},
		clickAddTag(tag) {
			this.tag.addTag(tags.getTag(tag.type));	
		},
		clickDeleteTag(index) {
			this.tag.children.splice(index,1);
		},
		clickSwapTag(index1, index2) {
			var tag = this.tag;
			if (index1 < 0 || index2 >= tag.children.length) {
				return;
			}
			var tmp = tag.children[index1];
			vue.set(tag.children, index1, tag.children[index2]);
			vue.set(tag.children, index2, tmp);
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
			console.log(getSelection());
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
	},

	components: {
		markdown,
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

.attrInputContainer>span{
	display:inline-block;
	width:30%;
	text-align:right;
}

.attrInputContainer>input{
	border:none;
	border-bottom: 1px solid #A7A7A7;
	font-size: 16px;
	width:60%;
	margin-left:4px;
}
.attrInputContainer>input:focus {
	outline:none;
	border-bottom-color: #3977AD;
}

.navTagSubItemContainer {
	paddiv-left:20px;
}
.navTagSubItemContainer:hover{
	cursor:pointer;
}
</style>
