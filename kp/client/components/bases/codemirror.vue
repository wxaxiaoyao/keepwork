<template>
	<codemirror ref="codemirror" ></codemirror>
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
	//name:"codemirror",

	data: function() {
		var self = this;
		return {
			keyMap:{
				"Ctrl-S": function(cm) {
					self.$emit("save", {
						filename: self.currentFilename,
						text:self.codemirror.getValue()
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
		codemirror() {
			return this.$refs.codemirror.codemirror;
		},
		text() {
			return this.value.text || "";
		},
	},
	watch: {
		"value": function(val) {
			this.swapDoc(val.filename, val.text);	
		},
	},
	methods: {
		initCodeMirror() {
			var self = this;

			self.codemirror.setSize("100%", "100%");
			self.originDoc = self.codemirror.getDoc();

			self.codemirror.on("change", function (cm, changeObj) {
				// 代码折叠
				foldWikiBlock(cm, changeObj);

				// change
				var text = self.codemirror.getValue();

				self.$emit("change", {filename:self.currentFilename, text:text});
			});

			self.codemirror.on("cursorActivity", function(cm){
				var pos = self.codemirror.getCursor();
				self.$emit("cursorActivity", pos);
			});

			self.codemirror.setOption("extraKeys", this.keyMap);

			self.codemirror.setValue(self.text);
		},
		swapDoc(filename, text) {
			text = text || "";
			if (filename) {
				if (!this.docMap[filename]) {
					this.docMap[filename] = this.CodeMirror.Doc(text, 'markdown');
				}
				this.codemirror.swapDoc(this.docMap[filename]);
			} else {
				this.codemirror.swapDoc(this.originDoc);
			}
			this.currentFilename = filename;
			if (text) {
				this.codemirror.setValue(text);
			} else {
				this.CodeMirror && this.CodeMirror.signal(this.codemirror, "change", this.codemirror);
			}
		},
		getValue() {
			return {
				filename: this.currentFilename,
				text: this.codemirror.getValue(),
			};	
		},
	},
	created() {
		this.docMap = {};	
		this.currentFilename = undefined;
	},
	mounted() {
		this.CodeMirror = this.CodeMirror || require("codemirror");
		this.initCodeMirror();
	},

	inheritAttrs:false,
}
</script>
