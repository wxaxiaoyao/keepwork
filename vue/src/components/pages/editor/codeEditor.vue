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
			getFileByPath: 'gitlab/file',
			files: 'gitlab/files',
		}),
	},

	watch: {
		pagePath: function(path) {
			if (this.pages[path]) {
				this.value = {filename:path, text: this.pages[path].content};
				return;
			}
			this.setFile({projectId: this.projectId, path:path, ref:"master"});
		},

		files: function(files) {
			var file = files[this.pagePath];
			if (!file) {
				return ;
			}

			this.value = {
				filename: this.pagePath,
				text:Base64.decode(file.content),
			};

			//console.log(files);
		},
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
