<template>
	<el-tabs type="border-card">
		<el-tab-pane label="属性">
			<div class="attrInputContainer">
				<input type="text" style="width:30%" placeholder="属性" v-model="attrKey" @blur="attrKeyBlur()"/>
				<input type="text" style="width:60%" placeholder="值" v-model="attrValue" @blur="attrValueBlur()"/>
			</div>
			<div class="attrInputContainer" v-for="x in attrList" :key="x.id">
				<span>{{x.name || x.attrName}}</span>	
				<input type="text" :placeholder="x.desc || x.name || x.attrName" v-model="attrs[x.attrName]"/>
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
			<JsonEditor :objData="jsonData" v-model="tag.vars" ></JsonEditor>
			<div v-for="(value, key) in vars">
				<div class="attrInputContainer">
					<input type="text" :placeholder="key" v-model="value.text"/>
				</div>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import vue from "vue";
import _ from "lodash";
import JsonEditor from "../../../lib/jsonEditor/JsonEditor.vue";

export default {
	data: function() {
		return {
			attrKey:"",
			attrValue:"",
			styleKey:"",
			styleValue:"",
			style:{},
			attrs:{},
			classes:{},
			vars:{},
			attrList:[],
		}
	},
	props: {
		tag: {
			type:Object,
		}
	},
	computed: {
		jsonData() {
			return this.vars || {};
		},
		navTagList() {
			if (!this.tag) {
				return;
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
		jsonData: function(val) {
			if (!this.tag) {
				return;
			}
			this.tag.vars = _.merge(this.tag.vars || {}, val);
		},
	
		tag: function(tag) {
			if (!tag) {
				return;
			}
			this.style = tag.styles;
			this.attrs = tag.attrs;
			this.classes = tag.classes;
		    this.vars = tag.vars;	
			this.attrList = tag.attrList;

			_.merge(this.jsonData, this.vars || {});
			console.log("----------", this.jsonData);
		},
	},
	methods: {
  	},
	created() {
		console.log(this.tag);
	},
	components:{
		JsonEditor,
	}
}
</script>

<style scoped>
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
</style>

