
define([
	'app',
	'helper/mdwiki',
	'helper/storage',
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
], function(app, mdwiki, storage, CodeMirror, cmeditorHtml, cmeditorCss, CodeMirrorCss, foldGutterCss) {
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

		editorObj.editorSource = $("#kp-editor-source");
		editorObj.editorPreview = $("#kp-editor-preview");
		editorObj.editorSourceContainer = $("#kp-editor-source-container");
		editorObj.editorPreviewContainer = $("#kp-editor-preview-container");
		editorObj.editorContainer = $("#kp-editor-container");
		editorObj.editorSplitStrip = $("#kp-editor-split-strip");
		initSplitStrip(editorObj);

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
			change(editorObj);
		});

		editor.on("scroll", function(cm) {
			sourceScroll(editorObj);
		});
		
		editorObj.editorPreviewContainer.on("scroll mouseenter mouseleave", function(e){
			previewScroll(editorObj, e);

		});

		var height = $(selector).css("height");
		editor.setSize("auto", height);
		editorObj.editorPreview.css("height", height);
		setPreviewScale(editorObj);

		editorObj.editor = editor;
		return editor;
	}
	// 拖拽分隔条
	function initSplitStrip(editor) {
		var col1=editor.editorSourceContainer;
		var col2=editor.editorPreviewContainer;
		var col1Width=col1.width();
		var col2Width=col2.width();
		var startX=0;
		var mousemoveEvent=function(event){
			col1.width(col1Width + event.clientX - startX);
			col2.width(col2Width - event.clientX + startX);
		};
		var mouseupEvent = function(){
			editor.editorContainer.off("mouseup", mouseupEvent);
			editor.editorContainer.off("mousemove mouseleave", mousemoveEvent);
			if (col1.width()<200){
				col2.width("100%");
				col1.width(0);
				col1.hide();
			}
			if(col2.width()<200){
				col1.width("100%");
				col2.width(0);
				col2.hide();
			}

			editor.viewChange && editor.viewChange();
		};

		editor.editorSplitStrip.on("mousedown", function(event){
			//console.log(col1Width, col2Width);
			col1Width=col1.width();
			col2Width=col2.width();
			col1.show();
			col2.show();
			startX = event.clientX;
			editor.editorContainer.on("mouseup mouseleave", mouseupEvent);
			editor.editorContainer.on("mousemove", mousemoveEvent);
		});
		//editor.editorSplitStrip.on("mouseup", mouseupEvent);
	}

	// 设置预览缩放
	function setPreviewScale(editor, scaleX, scaleY) {
		var baseWidthValue = 1200;
		var winWidth = $(window).width();
		var winHeight = $(window).height();
		var previewWidth = editor.editorPreviewContainer.width();
		var previewHeight = editor.editorPreviewContainer.height();
		var scaleWidth = winWidth < baseWidthValue ? winWidth : (previewWidth < baseWidthValue ? baseWidthValue : previewWidth);  // 限定预览窗口的最小宽度
		var scaleHeight = winHeight;
		if (scaleX) {
			scaleWidth = baseWidthValue;
			editor.editorPreviewContainer.css("overflow-x", "auto");
		} else {
			editor.editorPreviewContainer.css("overflow-x", "hidden");
		}

		scaleX = scaleX || (previewWidth / scaleWidth);
		scaleY = scaleY || (previewHeight / scaleHeight);

		editor.editorPreview.css("width", scaleWidth + "px");
		editor.editorPreview.css("height", scaleHeight + "px");
		editor.editorPreview.css("transform", 'scale(' + scaleX + ',' + scaleY +')');
		editor.editorPreview.css("transform-origin", 'left top');

		editor.editorPreviewScaleX = scaleX;
		editor.editorPreviewScaleY = scaleY;
	}

	// 代码滚动
	function sourceScroll(editor) {
		if (editor.isPreviewScroll)
			return;
		var scaleSize = editor.editorPreviewScaleY || 1;
		editor.scrollTimer && clearTimeout(editor.scrollTimer);
		editor.scrollTimer = setTimeout(function () {
			var initHegiht = editor.editor.getScrollInfo().top + editor.editor.heightAtLine(0);
			//console.log(initHegiht);
			var index = 0;
			var block;
			var blockList = editor.md.template.blockList;
			for (index = 0; index < blockList.length - 1; index++) {
				block = blockList[index];
				if (block.isTemplate)
					continue;

				//console.log(editor.editor.heightAtLine(block.token.start));
				if (editor.editor.heightAtLine(block.token.start) >= initHegiht)
					break;
			}
			block = blockList[index];
			editor.editorPreviewContainer.scrollTop(block.$element[0].offsetTop * scaleSize);
			editor.scrollTimer = undefined;
		}, 100);
	}

	// 预览滚动
	function previewScroll(editor, e) {
		if (e.type == 'mouseenter') {
			editor.isPreviewScroll = true;
			return;
		}
	    if (e.type == 'mouseleave') {
			editor.isPreviewScroll = false;
			return;
		}
	  	if (e.type == 'scroll') {
			if (!editor.isPreviewScroll) {
				return;
			}
	    }
		var scaleSize = editor.editorPreviewScaleY || 1;
		editor.scrollTimer && clearTimeout(editor.scrollTimer);
		editor.scrollTimer = setTimeout(function () {
			var initHeight = editor.editor.getScrollInfo().top + editor.editor.heightAtLine(0);
			var index = 0, block, blockList = editor.md.template.blockList;
			var scrollTop = editor.editorPreviewContainer[0].scrollTop;
			for (index = 0; index < blockList.length - 1; index++) {
				block = blockList[index];
				if (block.isTemplate)
					continue;
				//console.log(scrollTop, block.$element);
				if (scrollTop <= block.$element[0].offsetTop * scaleSize) {
					break;
				}
			}
			//console.log(block, index);
			block = blockList[index];
			editor.editor.scrollTo(0, editor.editor.getScrollInfo().top + editor.editor.heightAtLine(block.token.start) - initHeight);
			editor.scrollTimer = undefined;
		}, 100);
	}

	// 编辑器内容改变处理
	function change(editor){
		var text = editor.editor.getValue();
		storage.sessionStorageSetItem("cmeditor_temp_content", text);

		//console.log(text);
		editor.md.render(text);

		setPreviewScale(editor);

		editor.change && editor.change();
	}

	// 导出编辑器接口
	function exportInterface(editor) {
		editor.showSource = function() {
			editor.editorSourceContainer.show();
		}
		editor.hideSource = function() {
			editor.editorSourceContainer.hide();
		}
		editor.showPreview = function() {
			editor.editorPreviewContainer.show();
		}
		editor.hidePreview = function() {
			editor.editorPreviewContainer.hide();
		}
		editor.setValue = function(text) {
			editor.editor.setValue(text);
		}
		editor.setPreviewScale = function(scaleX, scaleY) {
			setPreviewScale(editor, scaleX, scaleY);
		}
		editor.swapDoc = function(filename, text) {
			if (!editor.docMap[filename]) {
				editor.docMap[filename] = CodeMirror.Doc(text, 'markdown');
			}
			editor.editor.swapDoc(editor.docMap[filename]);
			if (!text) {
				editor.editor.setValue(text);
			}
		}
		editor.getValue = function() {
			return editor.editor.getValue();
		}

	}

	// codemirror editor constructor
	function cmeditor(options) {
		//var height = $(selector).css("height");
		var editor = {
			docMap: {},
			selector: options.selector, 
			$scope: options.$scope,
			change: options.change,
			viewChange: options.viewChange,
		};


		//if (!editor.editor) {
			//console.log("编辑器创建失败...");
			//return;
		//}
		editor.md = mdwiki({containerId: "kp-editor-preview"});
		editor.editor = initEditor(editor);


		var text = storage.sessionStorageGetItem("cmeditor_temp_content") || ("");
		editor.editor.setValue(text);
		return editor;
	}

	return cmeditor;
});
