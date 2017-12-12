
define([
	'app',
	'helper/mdwiki',
    'codemirror',
	'text!html/cmeditor.html',
	// 样式
	'text!assets/css/cmeditor.css',
	'text!lib/codemirror/lib/codemirror.css',
	'text!codemirror/addon/fold/foldgutter.css',
    // 代码折叠
	'codemirror/mode/markdown/markdown',

	'codemirror/addon/fold/foldgutter',
	'codemirror/addon/fold/foldcode',
	'codemirror/addon/fold/markdown-fold',
	'codemirror/addon/fold/xml-fold',
    // 错误提示
    //'codemirror/addon/lint/json-lint',
    //'codemirror/addon/search/search',
    //'codemirror/addon/dialog/dialog',
    //'codemirror/addon/edit/continuelist',
    //'codemirror/addon/search/searchcursor',
    //'codemirror/addon/search/matchesonscrollbar',
    //'codemirror/addon/search/jump-to-line',
    //'codemirror/addon/scroll/annotatescrollbar',
    //'codemirror/addon/display/fullscreen',
], function(app, mdwiki, CodeMirror, cmeditorHtml, cmeditorCss, CodeMirrorCss, foldGutterCss) {
	var htmlStr = '<style>';
	htmlStr += cmeditorCss;
   	htmlStr += CodeMirrorCss;
	htmlStr += foldGutterCss;
	htmlStr += '</style>' + cmeditorHtml;

	// wiki block折叠
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

	// 编辑器初始化
	function initEditor(editorObj) {
		var $compile = app.ng_objects.$compile;
		var $scope = editorObj.$scope;
		var selector = editorObj.selector;
		var htmlContent = $compile(htmlStr)($scope);
		var textarea = $(selector).html(htmlContent).find('textarea')[0];

		console.log(textarea);

		editorObj.editorSource = $("#editor-source");
		editorObj.editorPreview = $("#editor-preview");

		var editor = CodeMirror.fromTextArea(textarea, {
			mode: 'markdown',
			lineNumbers: true,
			theme: "default",
			//viewportMargin: Infinity,
			// 自动换行
			lineWrapping: true,
			//indentUnit:1,
			//smartIndent:true,
			//代码折叠
			foldGutter: true,
			foldOptions: {
				rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.markdown, CodeMirror.fold.xml, CodeMirror.fold.wikiCmdFold),
				clearOnEnter: false,
			},
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
		});

		if (!editor) {
			console.log("编辑器创建失败...");
			return;
		}

		editor.on('fold', function (cm, from, to) {
			cm.getDoc().addLineClass(from.line, 'wrap', 'CodeMirrorFold');
			//console.log("--------------------fold--------------------");
		});
		editor.on('unfold', function (cm, from, to) {
			//console.log("----------------unfold--------------------");
			cm.getDoc().removeLineClass(from.line, 'wrap', 'CodeMirrorFold');
		});

		editor.on("change", function (cm, changeObj) {
			// 代码折叠
			foldWikiBlock(cm, changeObj);
			// 文本渲染
			editorObj.change();
		});

		var height = $(selector).css("height");
		editor.setSize("auto", height);
		editorObj.editorPreview.css("height", height);

		editorObj.editor = editor;
		return editor;
	}


	// codemirror editor constructor
	function cmeditor(selector, $scope) {
		//var height = $(selector).css("height");
		var editor = {selector: selector, $scope:$scope};

		editor.md = mdwiki({containerId: "editor-preview"});
		editor.editor = initEditor(editor);
		//if (!editor.editor) {
			//console.log("编辑器创建失败...");
			//return;
		//}

		editor.change = function(){
			var text = editor.editor.getValue();

			console.log(text);
			editor.md.render(text);
		}

		return editor;
	}

	return cmeditor;
});
