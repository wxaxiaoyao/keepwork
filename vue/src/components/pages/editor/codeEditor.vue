<template>
	<codemirror ref="codemirror" :value="value" class="kp_forbit_copy"
		@change="textChange" 
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
			change: {
				timer:undefined,
				filename:undefined,
			},
		};
	},

	computed: {
		...mapGetters({
			pagePath: "getPagePath",
			getPageContentByPath: "getPageContentByPath",
			switchPage: "switchPage",
		}),
		codemirror() {
			return this.$refs.codemirror.codemirror;
		},
	},

	watch: {
		switchPage(isSwitchPage) {
			if (!isSwitchPage) {
				return;
			}
			// 切换文件 立即写入
			this.savePageToDB(this.value.filename);
			
			// 切换文件
			this.value = {
				filename: this.pagePath,
				text:this.pagePath && this.getPageContentByPath(this.pagePath) ,
			};
			
			// 重置 切换状态
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

		savePageToDB(){
			var value = this.$refs.codemirror.getValue();
			var filename = value.filename;
			var text = value.text;
			this.change.timer && clearTimeout(this.change.timer);
			if (filename) {
				this.setPage({
					path: filename,
					content: text,
				});
			}
		},

		textChange(payload) {
			this.setPageContent(payload.text);
			var self = this;
			if (!payload.filename) {
				storage.sessionStorageSetItem(tempContentKey, payload.text);
				return;
			}

			if (this.change.filename != payload.filename) {
				this.change.filename = payload.filename;
				// 立即保存切换的后的内容
				self.savePageToDB();
				this.change.timer = undefined;
			} else {
				if (this.change.timer) {
					clearTimeout(this.change.timer);
				} else {
					self.savePageToDB(); // 第一次修改 也做立即保存
				}
				this.change.timer = setTimeout(function(){
					self.savePageToDB();
				}, 5000);
			}
		},

		save(payload) {
			let {filename, text} = payload;
			if (!filename) {
				return;
			}
			this.savePage({
				path: filename,
				content: text,
			});
		},
		cursorActivity() {

		},
	},

	created() {
		const self = this;
		g_app.vue.$on(g_app.consts.EVENT_ADD_MOD_TO_EDITOR, function(style){
			self.value = self.$refs.codemirror.getValue();
			self.value.text += '\n```@' + style.modName + '/' + style.styleName + '\n' +'```\n';
		});
	},

    components:{
		codemirror,
    },
}
</script>
