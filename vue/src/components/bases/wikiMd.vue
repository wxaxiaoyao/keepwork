
<template>
	<div v-html="html"></div>
</template>

<script>
import markdown from "../../lib/markdown/markdown.js";

var md = markdown();

export default {
	name:"wikiMd",

	data: function() {
		return {
			vars: {
				text: {
					text:"",
				}
			}
		}
	},

	computed: {
		html() {
			return md.render(this.vars.text.text); 
		},
	}
}
</script>
