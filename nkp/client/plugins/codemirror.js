import vue from "vue";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/addon/fold/foldgutter.css"
import "codemirror/mode/markdown/markdown.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";

const CodeMirror = require("codemirror");

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

CodeMirror.registerHelper("fold", "wikiCmdFold", wikiCmdFold);

const VueCodemirror = require("vue-codemirror");
vue.use(VueCodemirror, {
	options: {
		tabSize:4,
		mode:"text/x-markdown",
		lineNumbers: true,
		theme:"default",
		lineWrapping: true,
		foldGutter: true,
		foldOptions: {
			rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.markdown, CodeMirror.fold.xml, CodeMirror.fold.wikiCmdFold),
			//rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.markdown, CodeMirror.fold.xml),
			clearOnEnter: false,
		},
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
	}
});
