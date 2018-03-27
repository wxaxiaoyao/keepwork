<template>
	<!--<vue-codemirror ref="codemirror"  v-bind="$attrs" v-on="$listeners" :options="options"></vue-codemirror>-->
	<vue-codemirror ref="codemirror"  :options="options"></vue-codemirror>
</template>

<script>
import vue from "vue";
import CodeMirror from "codemirror";
import {codemirror} from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/addon/fold/foldgutter.css"
import "codemirror/mode/markdown/markdown.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";

vue.component("vueCodemirror", codemirror);

function wikiCmdFold(cm, start) {
	var line = cm.getLine(start.line);
	if ((!line) || (!line.match(/^```[@\/]/)))
		return undefined;
	//console.log(start);
	var end = start.line + 1;
	var lastLineNo = cm.lastLine();
	while (end < lastLineNo) {
		line = cm.getLine(end)
		if (line && line.match(/^```/))
			break;
		end++;
	}

	return {
		from: CodeMirror.Pos(start.line),
		to: CodeMirror.Pos(end, cm.getLine(end).length)
	};
}

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

CodeMirror.registerHelper("fold", "wikiCmdFold", wikiCmdFold);


export default {
	name:"codemirror",

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
					tabSize:4,
					mode:"text/x-markdown",
					lineNumbers: true,
					theme:"default",
					lineWrapping: true,
					//theme:"lesser-dark",
					foldGutter: true,
					foldOptions: {
						rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.markdown, CodeMirror.fold.xml, CodeMirror.fold.wikiCmdFold),
						clearOnEnter: false,
					},
					gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
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
					this.docMap[filename] = CodeMirror.Doc(text, 'markdown');
				}
				this.codemirror.swapDoc(this.docMap[filename]);
			} else {
				this.codemirror.swapDoc(editor.originDoc);
			}
			this.currentFilename = filename;
			if (text) {
				this.codemirror.setValue(text);
			} else {
				CodeMirror.signal(this.codemirror, "change", this.codemirror);
			}
		},
	},
	created() {
		this.docMap = {};	
		this.currentFilename = undefined;
	},
	mounted() {
		this.initCodeMirror();
	},

	inheritAttrs:false,
}
</script>
