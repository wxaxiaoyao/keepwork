
<template>
	<div v-html="html"></div>
</template>

<script>
import md from "@/lib/markdown/markdown.js";

export default {
	name:"wikiMd",

	data: function() {
		return {
			vars: {
				text: "",
			}
		}
	},

	computed: {
		html() {
			return md.render(this.vars.text); 
		},
	}
}
</script>
