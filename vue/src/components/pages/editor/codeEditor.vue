<template>
	<codemirror ref="codemirror" :value="value" 
		@change="change" 
		@save="save"
		@cursorActivity="cursorActivity"></codemirror>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import {Base64} from "js-base64";

import codemirror from "../../bases/codemirror.vue";

export default {
	data: function() {
		return {
			value:{},
			pages:{},
			projectId: 4980659,
		};
	},

	computed: {
		...mapGetters({
			pagePath: "getPagePath",
			pageContent: "getPageContent",
		}),
	},

	watch: {
		pageContent: function() {
			this.value = {
				filename: this.pagePath,
				text: this.pageContent,
			};
		}
	},

	methods: {
		...mapActions({
			setPageContent:'setPageContent',
			setFile: 'gitlab/setFile',
			saveFile: 'gitlab/saveFile',
		}),
		urlToPath(url) {
			return url + ".md";
		},
		change(val) {
			console.log(val);
			//this.setPageContent(val);
		},
		save(payload) {
			let {filename, text} = payload;
			this.saveFile({
				projectId:this.projectId,
				path: filename,
				content: text,
			});
		},
		cursorActivity() {

		},
	},

    components:{
		codemirror,
    },
}
</script>
