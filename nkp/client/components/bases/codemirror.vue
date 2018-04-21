<template>
	<codemirror v-if="isClient" ref="cm"></codemirror>
</template>

<script>
import vue from "vue";

	// 折叠wiki代码
function foldWikiBlock(cm, changeObj) {
	if (!changeObj) {
		return;
	}
	var start = -1, end = -1;
	for (var i = 0; i < changeObj.text.length; i++) {
		//cm.getDoc().removeLineClass(changeObj.from.line + i, 'wrap', 'CodeMirrorFold');
		if (/^```[@\/]/.test(changeObj.text[i])) {
			start = i;
		}
		if (start >= 0 && /^```/.test(changeObj.text[i])) {
			end = i;
		}
		if (start >= 0 && end >= 0) {
			cm.foldCode({line: changeObj.from.line + start, ch: changeObj.from.ch}, null, 'fold');
			start = end = -1;
		}
	}

	if (changeObj.origin == "setValue") {
		return;
	}

	start = end = -1;
	for (var i = 0; i < changeObj.removed.length; i++) {
		//cm.getDoc().removeLineClass(changeObj.from.line + i, 'wrap', 'CodeMirrorFold');
		if (/^```[@\/]/.test(changeObj.removed[i])) {
			start = i;
		}
		if (start >= 0 && /^```/.test(changeObj.removed[i])) {
			end = i;
		}
		if (start >= 0 && end >= 0) {
			cm.getDoc().removeLineClass(changeObj.from.line + i, 'wrap', 'CodeMirrorFold');
			start = end = -1;
		}
	}
}

function wrapfunc(self, funcname) {
	return function(...args) {
		(self[funcname])(...args);
	}
}

export default {
	data: function() {
		var self = this;
		return {
			isClient: false,
			keyMap:{
				"Ctrl-S": function(cm) {
					self.$emit("save", {
						filename: self.currentFilename,
						text:self.cm.getValue()
					});
				},
			},
		};
	},

	props: {
		options: {
			type: Object,
			default: function(){
				return {
				}
			},
		},
		value:{
			type:Object,
			default: function() {
				return {
				};
			}
		}
	},

	computed: {
		text() {
			return this.value.text || "";
		},
	},
	watch: {
		"value": function(val) {
			this.cm && this.swapDoc(val.filename, val.text);	
		},
	},
	methods: {
		initCodeMirror() {
			var self = this;

			self.cm.setSize("100%", "100%");
			self.originDoc = self.cm.getDoc();

			self.cm.on("change", function (cm, changeObj) {
				// 代码折叠
				foldWikiBlock(cm, changeObj);

				// change
				var text = self.cm.getValue();

				self.$emit("change", {filename:self.currentFilename, text:text});
			});

			self.cm.on("cursorActivity", function(cm){
				var pos = self.cm.getCursor();
				self.$emit("cursorActivity", pos);
			});

			self.cm.setOption("extraKeys", this.keyMap);

			self.cm.setValue(self.text);
		},
		swapDoc(filename, text) {
			text = text || "";
			if (filename) {
				if (!this.docMap[filename]) {
					this.docMap[filename] = this.CodeMirror.Doc(text, 'markdown');
				}
				this.cm.swapDoc(this.docMap[filename]);
			} else {
				this.cm.swapDoc(this.originDoc);
			}
			this.currentFilename = filename;
			if (text) {
				this.cm.setValue(text);
			} else {
				this.CodeMirror && this.CodeMirror.signal(this.cm, "change", this.cm);
			}
		},
		getValue() {
			return {
				filename: this.currentFilename,
				text: this.cm.getValue(),
			};	
		},
	},
	created() {
		this.docMap = {};	
		this.currentFilename = undefined;
	},
	mounted() {
		const self = this;
		self.isClient = true;
		self.$nextTick(function(){
			self.cm = self.$refs.cm.codemirror;
			self.CodeMirror = this.CodeMirror || require("codemirror");
			self.initCodeMirror();
			self.swapDoc(self.value.filename, self.value.text);	
		});
	},

	inheritAttrs:false,
}
</script>
