<template>
	<div v-html="vars.text.text"></div>
</template>


<script>
import vue from "vue";

export default {
	name:"wikiText",
	data:function() {
		return {
			tagName:"wiki-text",
		};
	},
	props:{
		vars:{
			type:Object,
			default:function() {
				return {
					text:{
						text:"文本内容",
					},
				};
			},
		},
	},
	computed: {
	},
	watch:{
	},
	methods: {
	},
	mounted() {
	},
	created(){
		console.log(this);
	}
}
</script>

