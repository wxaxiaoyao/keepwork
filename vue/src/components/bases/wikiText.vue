<template>
	<div @blur="blur"
		@focus="focus"
		@keyup="keyup"
		@keyup.enter="enter"
		v-html="params.text.text"
		:style="_style"></div>
</template>


<script>
import vue from "vue";
import text from "../common/text.js";

export default {
	name:"wikiText",
	data:function() {
		return {
		};
	},
	//mixins:[text],
	computed: {
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
		},
		bluri(){
			console.log("--1-----------");
			//this.params.text.text = this.$el.innerHTML;
		},
		keyup(){
		},
		enter(){
		},
	},
	mounted() {
	}
}
</script>

<style scoped>
</style>
