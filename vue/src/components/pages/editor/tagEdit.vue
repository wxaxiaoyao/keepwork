<template>
	<div class="flex-container tag-edit-container">
		<div class="tag-path-container">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item v-for="(x, index) in navTagList" :key="index" @click.native="clickSelectTag(x)"><span style="cursor:pointer">{{x.name || x.tagName}}</span></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-tabs type="border-card">
			<el-tab-pane label="样式">
				<div>
					<el-autocomplete class="inline-input" v-model="styleKey" :fetch-suggestions="queryStyleKeySearch" placeholder="请输入样式名">
					</el-autocomplete>
					<el-autocomplete class="inline-input" v-model="styleValue" :fetch-suggestions="queryStyleValueSearch" placeholder="请输入样式值" @keyup.native.enter="clickAddStyle">
					</el-autocomplete>
					<el-button @click="clickAddStyle">添加</el-button>
				</div>
				<JsonEditor :objData="styles || {}" v-model="tag.styles"></JsonEditor>
			</el-tab-pane>
			<el-tab-pane label="属性">
				<div style="display:flex">
					<el-input placeholder="标签别名" v-model="tag.aliasname">
						<template slot="prepend">标签别名</template>
					</el-input>
					<el-input placeholder="字母组合" v-model="tag.key">
						<template slot="prepend">标签KEY</template>
					</el-input>
				</div>
				<div>
					<el-autocomplete class="inline-input" v-model="attrKey" :fetch-suggestions="queryAttrKeySearch" placeholder="请输入属性名">
					</el-autocomplete>
					<el-autocomplete class="inline-input" v-model="attrValue" :fetch-suggestions="queryAttrValueSearch" placeholder="请输入属性值" @keyup.native.enter="clickAddAttr">
					</el-autocomplete>
					<el-button @click="clickAddAttr">添加</el-button>
				</div>
				<JsonEditor :objData="attrs || {}" v-model="tag.attrs"></JsonEditor>
			</el-tab-pane>
			<el-tab-pane label="类名">
				<JsonEditor :objData="classes || {}" v-model="tag.classes"></JsonEditor>
			</el-tab-pane>
			<el-tab-pane label="变量">
				<JsonEditor :objData="vars || {}" v-model="tag.vars" ></JsonEditor>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import vue from "vue";
import _ from "lodash";
import {mapActions, mapGetters} from "vuex";

const queryStyles = [
{value:"height", desc:"高度"},
{value:"width", desc:"宽度"},
{value:"background-color", desc:"背景色"},
{value:"border", desc:"边框"},
{value:"margin", desc:"外边距"},
{value:"padding", desc:"内边距"},
{value:"font-size", desc:"字体大小"},
{value:"color", desc:"字体颜色"},
{value:"display", desc:"显示类型"},
{value:"text-align", desc:"文本排列方式"},
];
export default {
	data: function() {
		return {
			attrKey:"",
			attrValue:"",
			styleKey:"",
			styleValue:"",
			styles:{},
			attrs:{},
			classes:{},
			vars:{},
			attrList:[],
			tag:{},
			queryStyles: queryStyles,
		}
	},
	props: ["rootTag"],
	computed: {
		...mapGetters({
			tagId: 'getTagId',
			getMode: "getMode",
		}),
		navTagList() {
			if (!this.tag) {
				return [];
			}
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
	watch: {
		tagId: function(tagId) {
			var tag = this.rootTag.findById(tagId);
			if (!tag) {
				return;
			}
			this.tag = tag;
			this.styles = tag.styles || {};
			this.attrs = tag.attrs || {};
			this.classes = tag.classes || {};
			this.vars = tag.vars || {};	
			this.attrList = tag.attrList;

			this.queryAttrs = [];

			const attrs = tag.attrList || [];
			for (var i = 0; i < attrs.length; i++){
				let attr = attrs[i];
				this.queryAttrs.push({
					value:attr.attrName,
					desc:attr.desc,
				});
			}
		},
	},
	methods: {
		...mapActions({
			setTagId:'setTagId',
		}),
		createFilter(queryString) {
			return (restaurant) => {
				return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		clickAddStyle() {
			if (!this.styleKey || !this.styleValue) {
				return;
			}

			vue.set(this.styles, this.styleKey, this.styleValue);

			this.styleKey = "";
			this.styleValue = "";
		},
		queryStyleKeySearch(queryString, cb) {
			const styles = queryString ? this.queryStyles.filter(this.createFilter(queryString)) : this.queryStyles;
			cb(styles);
		},
		queryStyleValueSearch(queryString, cb) {
			cb([]);
		},
		queryAttrKeySearch(queryString, cb) {
			const attrs = queryString ? this.queryAttrs.filter(this.createFilter(queryString)) : this.queryAttrs;
			cb(attrs);
		},
		queryAttrValueSearch(queryString, cb) {
			cb([]);
		},
		clickAddAttr() {
			if (!this.attrKey || !this.attrValue) {
				return;
			}

			vue.set(this.attrs, this.attrKey, this.attrValue);

			this.attrKey = "";
			this.attrValue = "";
		},
		clickSelectTag(x) {
			this.setTagId(x.tagId);
		},

  	},
	created() {
	},
	components:{
	}
}
</script>

<style scoped>
.tag-edit-container {
	overflow-y:auto;
}
.flex-container {
	height:100%;
	width:100%;
	display: flex;
	flex-direction: column;
}
.tag-path-container {
	border: 1px solid gray;
}

.el-tabs {
	flex:1;
	width: 100%;
	border: none;
}
</style>

