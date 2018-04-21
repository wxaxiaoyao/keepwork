<template>
	<div style="height:100%; width:100%; display:flex; flex-direction:column;">
		<div style="border:1px solid gray">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item v-for="(x, index) in navTagList" :key="index" @click.native="clickSelectTag(x)"><span style="cursor:pointer">{{x.name || x.tagName}}</span></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div style="display:flex; height:100%;">
		   	<el-tabs type="border-card" style="overflow-y:auto">
				<el-tab-pane label="样式">
				   	<div>
						<el-autocomplete class="inline-input" v-model="styleKey" :fetch-suggestions="queryStyleKeySearch" placeholder="请输入样式名">
						</el-autocomplete>
						<el-autocomplete class="inline-input" v-model="styleValue" :fetch-suggestions="queryStyleValueSearch" placeholder="请输入样式值" @keyup.native.enter="clickAddStyle">
						</el-autocomplete>
						<el-button @click="clickAddStyle">添加</el-button>
					</div>
					<!--<JsonEditor :objData="styles || {}" v-model="tag.styles"></JsonEditor>-->
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
					<!--<JsonEditor :objData="attrs || {}" v-model="tag.attrs"></JsonEditor>-->
				</el-tab-pane>
				<el-tab-pane label="类名">
					<!--<JsonEditor :objData="classes || {}" v-model="tag.classes"></JsonEditor>-->
				</el-tab-pane>
				<el-tab-pane label="变量">
					<!--<JsonEditor :objData="vars || {}" v-model="tag.vars" ></JsonEditor>-->
				</el-tab-pane>
			</el-tabs>
			<div style="display:flex; flex-direction:column; width:40%">
				<el-autocomplete class="inline-input" @select="tagKeyBlur" @blur="tagKeyBlur" v-model="tagKey" :fetch-suggestions="queryKeySearch" placeholder="请输入KEY">
					<template slot="prepend">KEY</template>
				</el-autocomplete>
				<div style="overflow-y:auto; flex:1">
					<codemirror v-if="isClient" ref="cm" :value="tagValue" :options="codemirrorOptions" style="height:100%"></codemirror>
				</div>
				<el-button @click="clickUpdateTagValueBtn">更新</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import {
	Breadcrumb,
	BreadcrumbItem,
	Autocomplete,
	Button,
	Input,
	Tabs,
	TabPane,
	Message,
} from "element-ui";
import vue from "vue";
import _ from "lodash";
import {mapActions, mapGetters} from "vuex";
import mdconf from "../../lib/markdown/mdconf.js";
import queryStyleKey from "./styleKey.js";
import queryStyleValue from "./styleValue.js"

//import "@/lib/jsonEditor";

export default {
	components: {
		[Breadcrumb.name]: Breadcrumb,
		[BreadcrumbItem.name]: BreadcrumbItem,
		[Autocomplete.name]: Autocomplete,
		[Button.name]: Button,
		[Input.name]: Input,
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
	},

	data: function() {
		return {
			isClient: false,
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
			queryStyleKey: queryStyleKey,
			queryStyleValue: queryStyleValue,
			tagKey:"",
			tagValue:"",

			codemirrorOptions: {
			},
		}
	},
	props: ["rootTag"],
	computed: {
		...mapGetters({
			tagId: 'editor/getTagId',
			getMode: "editor/getMode",
		}),
		codemirror() {
			return this.$refs.cm && this.$refs.cm.codemirror;
		},
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
			this.setTag(tag);
		},
	},
	methods: {
		...mapActions({
			setTagId:'editor/setTagId',
		}),
		setTag(tag) {
			if (!tag) {
				return;
			}

			if (this.tag.tagId != tag.tagId) {
				this.tagKeys = _.map(tag.getPaths(), path => ({value:path}));
				this.tagKey = "";
				this.tagValue = "";
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
		tagKeyBlur() {
			const value = _.get(this.tag, this.tagKey, "");
			//console.log(value);
			this.tagValue = mdconf.jsonToMd(value);
		},
		clickUpdateTagValueBtn() {
			console.log(this, this.tagKey);
			if (!this.tagKey) {
				return;
			}
			const text = this.$refs.cm.codemirror.getValue();
			const oldvalue = _.get(this.tag, this.tagKey, "");
			if (_.isObject(oldvalue)) {
				const value = mdconf.mdToJson(text);
				if (_.isObject(value)) {
					//_.merge(oldvalue, value);
					_.each(value, (val, key) => vue.set(oldvalue, key, val));
				}
			} else if (_.isNumber(oldvalue)) {
				_.set(this.tag, this.tagKey, _.toNumber(text) || oldvalue);
			} else {
				_.set(this.tag, this.tagKey, text);
			}
			this.setTag(this.tag);
		},
		queryKeySearch(queryString, cb) {
			const list = this.tagKeys.filter(key => key.value.toLowerCase().indexOf(queryString) == 0);
			cb(list);
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
			const styles = this.queryStyleKey.filter(val => val.value.toLowerCase().indexOf(queryString) == 0);
			cb(styles);
		},
		queryStyleValueSearch(queryString, cb) {
			let list = this.queryStyleValue[this.styleKey] || [];
			list = list.filter(val => val.value.toLowerCase().indexOf(queryString) == 0)
			cb(list);
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
	mounted() {
		const self = this;
		self.isClient= true;
		self.$nextTick(function() {
			self.codemirror &&self.codemirror.setOption("extraKeys", {
				"Ctrl-S": function(cm) {
					self.clickUpdateTagValueBtn();
				},
			});
		});
	},
}
</script>

<style>
.CodeMirror {
	height:100%;
}
</style>
<style scoped>
.el-tabs {
	flex:1;
	width: 100%;
	border: none;
}
</style>

