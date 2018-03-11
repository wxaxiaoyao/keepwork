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
			<div ref="editor" contenteditable="plaintext-only" 
				style="-webkit-user-modify: read-write-plaintext-only;
					   -webkit-line-break: normal;
					   -webkit-tap-highlight-color:rgba(0,0,0,0);
					   outline:none;"
				@change="change" 
				@blur="blur"
				@keyup.enter="enter"
				@mouseup="mouseup"
				@select="select">
					<component :is="tagHtml" :params="tagParams"></component>
					<!--<div></div>-->
					<!--<h3>test</h3>-->
					<!--<h2>h2</h2>-->
					<!--<p>段落</p>-->
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
						<div v-for="x in tag.children" :key="x.id" class="navTagSubItemContainer">
							<span @click="clickSelectTag(x)">
								{{x.name || x.type}}
							</span>
							<span @click="clickDeleteTag($event, x.id)"><i class="fa fa-trash-o"></i></span>
							<span v-show="x.id != 0" @click="clickSwapTag($event, x.id - 1, x.id)"><i class="fa fa-lov-arrow-up"></i></span>
							<span v-show="x.id == tag.children.length - 1" @click="clickSwapTag($event, x.id, x.id + 1)"><i class="fa fa-lov-arrow-down"></i></span>
						</div>
					</el-tab-pane>
				</el-tabs>
				<el-tabs type="border-card">
					<el-tab-pane label="属性">
						<div class="attrInputContainer">
							<input type="text" style="width:30%" placeholder="属性" v-model="attrKey" @blur="attrKeyBlur()"/>
							<input type="text" style="width:68%" placeholder="值" v-model="attrValue" @blur="attrValueBlur()"/>
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
							<input type="text" style="width:68%" placeholder="值" v-model="styleValue" @blur="styleValueBlur()"/>
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
import htmlContent from "./editor.html";
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
			{
				//id:1,
				modName:"test",
				cmdName:"test",
				modParams:{
					title:"hello world",
				},
				isWikiBlock:true,
				htmlContent: "<div>html content</div>",
			},
			{
				//id:1,
				modName:"test",
				cmdName:"test",
				modParams:{
					style:"style1",
					title:"hello world",
				},
				isWikiBlock:true,
				htmlContent: "<div>html content</div>",
			},
			],
		}
	},
	computed: {
		tagHtml: function() {
			var tagHtmlStr = this.tag.html();
			console.log(tagHtmlStr);
			//var res = this.compile(tagHtmlStr);
			return {
				template: tagHtmlStr,
				props:['params'],
				created(){
					console.log(this);
				}
				//staticRenderFns: res.staticRenderFns,
			}
		},
		tagParams() {
			return this.tag.getParams();
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
		change() {
			console.log(this);
		},
		blur() {
			console.log("blur", this);
		},
		select(){
			console.log("selelct");
		},
		enter(){
			var editor = this.$refs.editor;
			console.log(editor);
		},
		mouseup(){
			console.log(getSelection());
		},
	},
	created(){
	},

	components: {
		markdown,
	},
}
</script>

<style>
.modeditorContainer {
	display:flex;
	height:100%;
}

.tagsContainer {
	width: 200px;
}

.previewContainer {
	flex:1;
}

.editorContainer {
	display:flex;
	flex-direction:column;
	width:300px;
}

.navTagContainer {
	height: 300px;
}


.attrsContainer {
	flex:1;
}

#modeditorarea {
	border:1px solid #ccc;
	height: 100%;
}

#modeditorarea:hover {
	cursor:pointer;
}

.full-screen {
	position:absolute;
	top:50px;
	bottom:0px;
	right:0px;
	left:0px;
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
	width:68%;
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
