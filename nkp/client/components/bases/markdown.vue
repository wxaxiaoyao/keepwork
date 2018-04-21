
<template>
	<div v-html="html"></div>
</template>

<script>
import md from "../..//lib/markdown/index.js";

export default {
	name:"markdown",

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
