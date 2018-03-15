
<template>
	<component :is="comp" :tag="tag" v-bind="$attrs" v-on="$listeners"></component>
</template>

<script>
import richtextEditor from "./richtextEditor.vue";
import markdownEditor from "./markdownEditor.vue";
export default {
	name:"tagEditor",

	props: {
		tag:{
			type:Object,
		},
	},

	inheritAttrs: false,

	computed: {
		comp() {
			return markdownEditor;
			return richtextEditor;
			return {
				template:"<div></div>"
			};
		},
	},

	components: {
		richtextEditor,
		markdownEditor,
	},

	methods: {
	},
}
</script>
