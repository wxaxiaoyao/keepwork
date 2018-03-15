<template>
	<div v-html="vars.text.text"></div>
</template>


<script>
import vue from "vue";
import text from "../common/text.js";

export default {
	name:"wikiText",
	data:function() {
		return {
			tagName:"wiki-text",
			vars:{
				text:{
					text:"文本内容",
				}
			}
		};
	},
	//mixins:[text],
	computed: {
	},
	//props:["params"],
	props:{
	},
	watch:{
	},
	methods: {
	},
	mounted() {
	}
}
</script>

<style scoped>
</style>
