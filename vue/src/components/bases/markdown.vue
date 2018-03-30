<template>
	<tag :tag="rootTag"></tag>
</template>

<script>
import tag from "../common/tag.js";

import tags from "../modeditor/tags.js";
import markdown from "../../lib/markdown/index.js";

export default {	
	name: "markdown",

	data: function() {
		return {
			rootTag: tags.getTag(),
		};
	},

	props: {
		text: {
			type:String,
		},
	},

	methods: {

	}
}

</script>
