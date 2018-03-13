<template>
	<div @blur="blur"
		@focus="focus"
		@keyup="keyup"
		style="-webkit-user-modify:read-write-plaintext-only;
			   -webkit-line-break: normal;
			   -webkit-tap-highlight-color:rgba(0,0,0,0);
			   outline:none;">
	
	</div>
</template>


<script>
import vue from "vue";
import markdown from "../markdown";

export default {
	name:"wikiText",
	data:function() {
		return {};
	},
	computed: {
		componentHtml(){
			return this.params.text.text;
		},
	},
	//props:["params"],
	props:{
		params:{
			type:Object,
			default: function() {
				return {
					text: {
						text:"文本组件",
					},
				};
			},
		},
	},
	watch:{
	},
	methods: {
		focus(){
			console.log("--------focus---------------");
		},
		blur(){
			console.log("--------blur----------------");
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
