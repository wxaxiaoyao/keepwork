
define([
	"app",
	"modeditor/tag",
], function(app, tagFactory){

	var tags = {};
	
	tags.tagList = [
	{
		name:"行容器",
		type:"rowDiv",
		tag:"div",
		classify: "基本Tag",
	},
	{
		name:"列容器",
		type:"colDiv",
		tag:"div",
		classify: "基本Tag",
	},
	{
		name:"文本",
		type:"text",
		tag:"div",
		classify: "基本Tag",
	},
	{
		name:"图标",
		type:"i",
		tag:"i",
		classify: "基本Tag",
	},
	{
		name:"一级标题",
		type:"h1",
		tag:"h1",
		classify: "基本Tag",
	},
	{
		name:"二级标题",
		type:"h2",
		tag:"h2",
		classify: "基本Tag",
	},
	{
		name:"三级标题",
		type:"h3",
		tag:"h3",
		classify: "基本Tag",
	},
	//{
		//name:"段落",
		//type:"p",
		//tag:"p",
	//},
	{
		name:"图片",
		type:"img",
		tag:"img",
		classify: "基本Tag",
	},
	{
		name:"链接",
		type:"a",
		tag:"a",
		classify: "基本Tag",
	},
	{
		name:"布局行",
		type:"elRow",
		tag:"el-row",
		classify: "组件-基本-Tag",
	},
	{
		name:"布局列",
		type:"elCol",
		tag:"el-col",
		classify: "组件-基本-Tag",
	},
	{
		name:"布局-外层容器",
		type:"elContainer",
		tag:"el-container",
		classify: "组件-基本-Tag",
	},
	{
		name:"布局-顶栏容器",
		type:"elHeader",
		tag:"el-header",
		classify: "组件-基本-Tag",
	},
	{
		name:"布局-侧栏容器",
		type:"elAside",
		tag:"el-aside",
		classify: "组件-基本-Tag",
	},
	{
		name:"布局-主区域容器",
		type:"elMain",
		tag:"el-main",
		classify: "组件-基本-Tag",
	},
	{
		name:"布局-底栏容器",
		type:"elFooter",
		tag:"el-footer",
		classify: "组件-基本-Tag",
	},
	{
		name:"按钮",
		type:"elButton",
		tag:"el-button",
		classify: "组件-基本-Tag",
	},
	{
		name:"文本",
		type:"wikiText",
		tag:"wiki-text",
		classify: "组件-功能-Tag",
	},
	{
		name:"走马灯",
		type:"wikiCarousel",
		tag:"wiki-carousel",
		classify: "组件-功能-Tag",
	},
	];

	// tag树型结构
	tags.tagTree = function() {
		var self = this;
		var tree = [
		{
			classify: "基本Tag",
		},
		{
			classify: "组件-基本-Tag",
		},
		{
			classify: "组件-功能-Tag",
		},
		];

		var tagList = self.tagList;
		for (var i = 0; i < tagList.length; i++){
			for (var j = 0; j < tree.length; j++) {
				if (tree[j].classify == tagList[i].classify) {
					tree[j].nodes = tree[j].nodes || [];
					tree[j].nodes.push(tagList[i]);
				}
			}
		}
		
		return tree;
	}

	// 定义容器tag
	tags.divTag = function() {
		var tag = tagFactory("div");
		tag.name = "容器";

		//tag.attrs.style["display"] = "flex";

		return tag;
	}

	// 行容器
	tags.rowDivTag = function() {
		var self = this;
		var tag = self.divTag();

		tag.name = "行容器";
		tag.attrs.style["display"] = "flex";

		return tag;
	}

	// 列容器
	tags.colDivTag = function() {
		var self = this;
		var tag = self.divTag();

		tag.name = "列容器";
		tag.attrs.style["display"] = "flex";
		tag.attrs.style["flex-direction"] = "column";

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

		//tag.vars = [
			//{
				//text:"http://www.runoob.com/try/bootstrap/layoutit/v3/default3.jpg",
				//$data:{
					//type:"attr",  // 属性变量
					//attrName:"ng-src",
					//key:"src",
				//},
			//},
		//];

		return tag;
	}

	// 文本tag
	tags.textTag = function() {
		var tag = tagFactory("div");
		tag.name = "文本";

		tag.vars = {
			text: {
				text:"这是一个文本",
				$data: {
					type:"text",  // 文件变量  用于标签内容显示
					key:"content",  // 变量名
					attrName:"v-text",
				}
			}
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
					key:"content",  // 变量名
					attrName:"v-text",
				}
			}
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

	// 段落标签
	tags.pTag = function() {
		var tag = tagFactory("p");
		tag.name = "段落";

		//tag.addTag(tags.textTag({text:"这是一个段落"}));

		tag.vars = {
			text: {
				text:"这是一个段落",
				$data: {
					type:"text",  // 文件变量  用于标签内容显示
					key:"content",  // 变量名
					attrName:"v-text",
				}
			}
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
					key:"content",  // 变量名
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
		tag.name = "布局-外层容器";
		
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
		tag.name = "布局-顶栏容器";
		
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
		tag.name = "布局-侧栏容器";
		
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
		tag.name = "布局-主区域容器";
		
		return tag;
	}

	tags.elFooterTag = function(){
		var tag = tagFactory("el-footer");
		tag.name = "布局-底栏容器";
		
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
		
		tag.vars = [
			{
				text:"这是一个按钮",

				$data: {
					type:"text",  // 文件变量  用于标签内容显示
					key:"content",  // 变量名
				}
			}
		];

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

	tags.wikiTextTag = function() {
		var tag = tagFactory("wiki-text");
		tag.name = "文本";

		tag.vars = {
			text: {
				text:"文本组件",
				$data:{
					type:"text",
				},
			},
		};
		
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

	tags.getTag = function(typ) {
		var funcname = typ + "Tag";

		if (tags[funcname] && typeof(tags[funcname]) == "function") {
			return (tags[funcname])();
		}

		return undefined;
	}


	return tags;
})
