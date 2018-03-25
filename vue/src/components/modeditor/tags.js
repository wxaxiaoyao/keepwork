import _ from 'lodash';

import tagFactory from "./tag.js";
var tags = {};

// 定义容器tag
tags.divTag = function() {
	var tag = tagFactory("div");
	tag.name = "容器";

	return tag;
}

// 行容器
tags.rowDivTag = function() {
	var self = this;
	var tag = self.divTag();

	tag.name = "行容器";
	tag.styles["display"] = "flex";

	return tag;
}

// 列容器
tags.colDivTag = function() {
	var self = this;
	var tag = self.divTag();

	tag.name = "列容器";
	tag.styles["display"] = "flex";
	tag.styles["flex-direction"] = "column";

	return tag;
}

// 定义图片tag
tags.imgTag = function() {
	var tag = tagFactory("img");
	tag.name = "图片";
	
	tag.attrs.src = "http://www.runoob.com/try/bootstrap/layoutit/v3/default3.jpg";
	tag.attrList = [
	{
		name: "图片地址",
		attrName: "src",
		defaultValue: tag.attrs.src,
		desc: "图片链接",
	},
	];

	tag.vars = {
		src: {
			text:undefined,
			$data:{
				type:"text",
				attrName:"src",
				attrNamePrefix:":",
				desc:"图片地址",
				key:".text",
			}
		},
	}

	return tag;
}

// 文本
tags.spanTag = function(text) {
	var tag = tagFactory("span");
	tag.name = "文本";

	tag.vars = {
		text: {
			text: text || "文本",
			$data: {
				type:"text",  // 文件变量  用于标签内容显示
				attrName:"v-text",
				key:".text",
			}
		},
	}

	return tag;
}
// 标题
tags.hTag = function(hn) {
	var tag = tagFactory(hn);
	tag.name = "标题";

	tag.vars = {
		text: {
			text:"这是一个标题",
			$data: {
				type:"text",  // 文件变量  用于标签内容显示
				attrName:"v-text",
				key:".text",
			}
		},
		//tagName: {
			//text:undefined,
			//$data:{
				//type:"text",
				//attrName:"tagName",
				//attrNamePrefix:":",
				//desc:"h1,h2,h3,h4,h5,h6",
			//}
		//}
	}

	return tag;
}

// 一级标题
tags.h1Tag = function() {
	var self = this;

	var tag = self.hTag("h1");
	tag.name = "一级标题";

	return tag;
}

// 二级标题
tags.h2Tag = function() {
	var self = this;
	var tag = self.hTag("h2");
	tag.name = "二级标题";

	return tag;
}

// 三级标题
tags.h3Tag = function() {
	var self = this;
	var tag = self.hTag("h3");
	tag.name = "三级标题";

	return tag;
}

// 段落
tags.pTag = function() {
	var tag = tagFactory("tag");
	tag.attrs.tagName = "p";
	tag.name = "段落";

	tag.vars = {
		text: {
			text:"这是一个段落",
			$data: {
				type:"text",  // 文件变量  用于标签内容显示
				attrName:"v-text",
			}
		},
	}

	return tag;
}


// 链接
tags.aTag = function() {
	var tag = tagFactory("a");
	tag.name = "链接";

	tag.attrList = [
	{
		name: "链接地址",
		attrName: "href",
		defaultValue:"",
		desc: "链接地址",
	},
	];
	
	tag.vars = {
		text: {
			text:"这是一个链接",
			$data: {
				type:"text",  // 文件变量  用于标签内容显示
				attrName:"v-text",
			}
		}
	}

	return tag;
}

// 图标
tags.iTag = function(){
	var tag = tagFactory("i");
	tag.name = "图标";

	tag.attrs.class = "el-icon-info";
	tag.attrList = [
	{
		name: "图标类名",
		attrName: "class",
		defaultValue:"",
		desc: "图标类名",
	},
	];

	return tag;
}

// element ui base on vue 组件
tags.elRowTag = function() {
	var tag = tagFactory("el-row");
	tag.name = "布局行";

	tag.attrList = [
	{
		name: "栅格间隔",
		attrName: ":gutter",
		defaultValue:"",
		desc: "栅格间隔",
	},
	];
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":gutter",
				//key:"gutter", // 栅格间隔
			//},
		//},
	//];

	return tag;
}

tags.elColTag = function() {
	var tag = tagFactory("el-col");
	tag.name = "布局列";

	tag.attrList = [
	{
		name: "栅格列数",
		attrName: ":span",
		defaultValue:"",
		desc: "栅格占据的列数",
	},
	{
		name: "偏移列数",
		attrName: ":offset",
		defaultValue:"",
		desc: "栅格左侧的间隔格数",
	},
	{
		name: "右移格数",
		attrName: ":push",
		defaultValue:"",
		desc: "栅格向右移动格数",
	},
	{
		name: "左移格数",
		attrName: ":pull",
		defaultValue:"",
		desc: "栅格向左移动格数",
	},
	];
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":span",
				//key:"span", // 栅格间隔
			//},
		//},
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":offset",
				//key:"offset", 
			//},
		//},
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":push",
				//key:"push", 
			//},
		//},
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":pull",
				//key:"pull", 
			//},
		//},
	//];

	return tag;
}

tags.elContainerTag = function() {
	var tag = tagFactory("el-container");
	tag.name = "外层容器";
	
	tag.attrList = [
	{
		name: "方向",
		attrName: "direction",
		defaultValue:"",
		desc: "子元素的排列方向",
	},
	];
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  // 属性变量
				//attrName:":direction",
				//key:"direction", // 栅格间隔
			//},
		//},
	//];

	return tag;
}

tags.elHeaderTag = function() {
	var tag = tagFactory("el-header");
	tag.name = "顶栏容器";
	
	tag.attrList = [
	{
		name: "高度",
		attrName: "height",
		defaultValue:"",
		desc: "顶栏高度",
	},
	];
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  
				//attrName:":height",
				//key:"height", 
			//},
		//},
	//];

	return tag;
}

tags.elAsideTag = function() {
	var tag = tagFactory("el-aside");
	tag.name = "侧栏容器";
	
	tag.attrList = [
	{
		name: "宽度",
		attrName: "width",
		defaultValue:"",
		desc: "侧边栏宽度",
	},
	];
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  
				//attrName:":width",
				//key:"width", 
			//},
		//},
	//];

	return tag;
}

tags.elMainTag = function(){
	var tag = tagFactory("el-main");
	tag.name = "主区域容器";
	
	return tag;
}

tags.elFooterTag = function(){
	var tag = tagFactory("el-footer");
	tag.name = "底栏容器";
	
	tag.attrList = [
	{
		name: "高度",
		attrName: "height",
		defaultValue:"",
		desc: "底栏高度",
	},
	];
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  
				//attrName:":height",
				//key:"height", 
			//},
		//},
	//];

	return tag;
}

tags.elButtonTag = function() {
	var tag = tagFactory("el-button");
	tag.name = "按钮";
	
	tag.vars = {
		text: {
			text:"这是一个按钮",

			$data: {
				type:"text",  // 文件变量  
				attrName:"v-text",
				key:".text",
			}
		}
	};

	return tag;
	
}

//tags.elCarouselTag = function() {
	//var tag = tagFactory("el-carousel");
	//tag.name = "布局-底栏容器";
	
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  
				//attrName:":height",
				//key:"height", 
			//},
		//},
	//];

	//return tag;
//}

//tags.elCarouselItemTag = function() {
	//var tag = tagFactory("el-carousel-item");
	//tag.name = "布局-底栏容器";
	
	//tag.vars = [
		//{
			//text:"",
			//$data:{
				//type:"attr",  
				//attrName:":height",
				//key:"height", 
			//},
		//},
	//];

	//return tag;
//}


tags.wikiRichtextTag = function() {
	var tag = tagFactory("wiki-richtext");
	tag.name = "富文本";

	tag.vars = {
		text: {
			text:"富文本组件",
			//text:"",
			$data:{
				type:"text",
			},
		},
	};
	tag.attrs.style["min-height"] = "20px";
	
	//tag.innerHtmlChange = function() {
		//var el = document.getElementById(this.tagId);
		//if (!el) {
			//return;
		//}
		////console.log([el]);
		//this.vars.text.text = el.innerHTML.trim();
	//}
	return tag;
}

tags.wikiMarkdownTag = function() {
	var tag = tagFactory("wiki-markdown");
	tag.name = "富文本";

	tag.vars = {
		text: {
			text:"富文本组件",
			//text:"",
			$data:{
				type:"text",
			},
		},
	};
	tag.attrs.style["min-height"] = "20px";
	
	//tag.innerHtmlChange = function() {
		//var el = document.getElementById(this.tagId);
		//if (!el) {
			//return;
		//}
		////console.log([el]);
		//this.vars.text.text = el.innerHTML.trim();
	//}
	return tag;
}


tags.wikiCarouselTag = function() {
	var tag = tagFactory("wiki-carousel");
	tag.name = "走马灯";

	tag.vars = {
		items:{
			list:[],
			$data:{
				type:"list",
			},
		}
	};
	
	return tag;
}

tags.htmlTag = function(html) {
	var tag = this.getTag("div");
	tag.vars = {
		text: {
			text: html || "文本",
			$data: {
				type:"text",  // 文件变量  用于标签内容显示
				attrName:"v-html",
				key:".text",
			}
		},
	}

	return tag;
}

tags.wikiMdTag = function(text) {
	var tag = tagFactory("wiki-md");
	tag.vars = {
		text: {
			text: text || "markdwon文本",
			$data: {
				type:"text",  // 文件变量  用于标签内容显示
				key:".text",
			}
		},
	}

	return tag;
}

tags.getTag = function(typ) {
	var funcname = _.camelCase(typ) + "Tag";
	var tag = undefined;

	if (tags[funcname] && typeof(tags[funcname]) == "function") {
		tag = (tags[funcname])();
	} else {
		tag = tagFactory(typ);
	}
	tag.type = typ;

	return tag;
}

export default tags;
