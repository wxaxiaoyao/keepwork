<template>
	<div @mouseup="mouseup">
		<div v-if='mode == "editor" && isFocus'>
			<button v-for="x in buttons" @click="clickButton(x)">{{x.text}}</button>
		</div>
		<div :style="params.style" 
			@focus="focus"
			@blur="blur"
			v-html="params.text.text">
		</div>
	</div>
</template>


<script>
import vue from "vue";
import markdown from "../markdown";

export default {
	name:"richtext",
	data:function() {
		return {
			isFocus: false,
			buttons:[
			{
				cmdName:"bold",
				text:"粗体",
			},
			{
				cmdName:"italic",
				text:"斜体"
			},
			{
				cmdName:"underline",
				text:"下划线",
			},
			{
				cmdName:"justifyLeft",
				text:"左对齐",
			},
			{
				cmdName:"justifyCenter",
				text:"居中对齐",
			},
			{
				cmdName:"justifyRight",
				text:"右对齐",
			},
			{
				cmdName:"justifyFull",
				text:"两端对齐",
			},
			{
				cmdName:"insertOrderedList",
				text:"有序列表",
			},
			{
				cmdName:"insertUnorderedList",
				text:"无序列表",
			},
			{
				cmdName:"insertHTML",
				text: "链接",
				value:"<a href='www.baidu.com'>百度</a>"
			},
			{
				cmdName:"removeFormat",
				text:"清除格式",
			},
			],
		}
	},
	computed: {
		componentHtml(){
			return this.params.text.text;
		},
	},
	props:{
		params:{
			type:Object,
			default: function() {
				return {
					text: {
						text:"富文本",
					},
					style: {
						"-webkit-user-modify":"read-write",	
						"word-wrap":"break-word",
					},
				};
			},
		},
		mode: {
			type:String,
			default:"editor",
		},
	},
	watch:{
		mode: function(val, oldVal) {
			if (val == "editor") {
				this.params.style["-webkit-user-modify"] = "read-write";
			} else {
				delete this.params.style["-webkit-user-modify"];
			}
		},
	},
	methods: {
		clickButton(x){
			document.execCommand(x.cmdName, false, x.value);	
		},
		mouseup(){
			this.isFocus = true;
			if (this.focusTimer) {
				clearTimeout(this.focusTimer);
				this.focusTimer = undefined;
			}
		},
		focus(){
			this.isFocus = true;
		},
		blur(){
			var self = this;
			this.focusTimer = setTimeout(function(){
				self.isFocus = false;
				this.focusTimer = undefined;
			},300);
		},
		keyup(){
			console.log("----------keyup-------------");
			this.params.text.text = this.$el.innerHTML;
		},
		enter(){
			this.params.text.text = this.params.text.text.trim().split("\n").join("");
			console.log("-----------", this.params.text.text);
		},
		_delete(){
			console.log(this.params.text.text);
		},
	},
	mounted() {
		this.$nextTick(function(){
		});
	}
}
</script>

<style scoped>
</style>
