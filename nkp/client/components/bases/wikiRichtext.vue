<template>
	<div>
		<div v-if="isFocus" 
			@blur="blur"
			@focus="focus"
			@keyup="keyup"
			@keyup.enter="enter"
			v-html="params.text.text"
			style="-webkit-user-modify:read-write-plaintext-only;
				   -webkit-line-break: normal;
				   -webkit-tap-highlight-color:rgba(0,0,0,0);
				   outline:none;"></div>
		<div v-if="!isFocus"
			@focus="focus"
			@keyup="keyup"
		    @keyup.enter="enter"
		    v-html="textHtml"
			style="-webkit-user-modify:read-write-plaintext-only;
				   -webkit-line-break: normal;
				   -webkit-tap-highlight-color:rgba(0,0,0,0);
				   outline:none;"></div>
	</div>
</template>


<script>
import vue from "vue";
import markdown from "../../lib/markdown/markdown.js";

var md = markdown();

export default {
	name:"wikiRichtext",
	data:function() {
		return {
			isFocus:false,
			vars: {
				text:{
					text:"文本",
				},
			},
		};
	},
	computed: {
		textHtml(){
			var html = md.render(this.params.text.text.trim());
			return html;
		},
	},
	//props:["params"],
	props:{
	},
	watch:{
	},
	methods: {
		focus(){
			this.isFocus = true;
			//console.log("--------focus---------------");
		},
		blur(){
			this.isFocus = false;
			//console.log("--------blur----------------");
			//console.log(event.target.innerHTML);
			this.params.text.text = event.target.innerHTML;
		},
		keyup(){
			//console.log("----------keyup-------------");
		},
		enter(){
		},
	},
	mounted() {
	},
	created(){
		//console.log(global);
		//var self = this;
		//global.objectEvent.addEventListener("innerHTMLChange", function(params){
		//	console.log([self.$el]);
		//	console.log(params);
		//});
	},
}
</script>

<style scoped>
</style>
