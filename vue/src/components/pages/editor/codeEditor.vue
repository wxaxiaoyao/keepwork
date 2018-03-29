<template>
	<codemirror ref="codemirror" :value="value" class="kp_forbit_copy"
		@change="change" 
		@save="save"
		@cursorActivity="cursorActivity"></codemirror>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import {Base64} from "js-base64";

import storage from "../../../lib/storage.js";

import codemirror from "../../bases/codemirror.vue";

const tempContentKey = "cmeditor_temp_content";

export default {
	data: function() {
		return {
			value:{
				text:storage.sessionStorageGetItem(tempContentKey) || (""),
				filename:null,
			},
			pages:{},
		};
	},

	computed: {
		...mapGetters({
			pagePath: "getPagePath",
			getPageContentByPath: "getPageContentByPath",
			switchPage: "switchPage",
		}),
	},

	watch: {
		switchPage(isSwitchPage) {
			if (!isSwitchPage) {
				return;
			}
			this.value = {
				filename: this.pagePath,
				text:this.pagePath && this.getPageContentByPath(this.pagePath) ,
			};
			this.setSwitchPage(false);
		}
	},

	methods: {
		...mapActions({
			setPage: "setPage",
			setPageContent: "setPageContent",
			savePage: "savePage",
			setSwitchPage: "setSwitchPage",
		}),
		change(payload) {
			this.setPageContent(payload.text);

			if (!payload.filename) {
				storage.sessionStorageSetItem(tempContentKey, payload.text);
				return;
			}
			this.setPage({
				path:payload.filename,
				content:payload.text,
			});
		},
		save(payload) {
			let {filename, text} = payload;
			this.savePage({
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
