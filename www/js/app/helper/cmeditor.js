
define([
	'app',
	'helper/mdwiki',
	'helper/config',
	'helper/storage',
    'codemirror',
	'text!html/helper/cmeditor.html',
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
], function(app, mdwiki, config, storage, CodeMirror, cmeditorHtml, cmeditorCss, CodeMirrorCss, foldGutterCss) {
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

		//console.log(textarea, $(selector));
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

		editor.setOption("extraKeys", editorObj.keyMap);

		editor.on('fold', function (cm, from, to) {
			cm.getDoc().addLineClass(from.line, 'wrap', 'CodeMirrorFold');
			//console.log("--------------------fold--------------------");
		});
		editor.on('unfold', function (cm, from, to) {
			//console.log("----------------unfold--------------------");
			cm.getDoc().removeLineClass(from.line, 'wrap', 'CodeMirrorFold');
		});

		editor.on("change", function (cm, changeObj) {
			//console.log(changeObj);
			// 代码折叠
			foldWikiBlock(cm, changeObj);
			// 文本渲染
			change(editorObj);
		});

		editor.on("scroll", function(cm) {
			sourceScroll(editorObj);
		});

		editor.on("drop", function(cm, e){
			fileUpload(editorObj, e);
		});

		editor.on("paste", function(cm, e){
			paste(editorObj, e);
		});

		editor.on("cursorActivity", function(cm){
			editorObj.options.cursorActivity && editorObj.options.cursorActivity(editorObj);			
		});

		window.onresize = function() {
			initEditorSize(editorObj);
		}

		editorObj.editorPreviewContainer.on("scroll mouseenter mouseleave", function(e){
			previewScroll(editorObj, e);

		});

		editorObj.editor = editor;
		editorObj.originDoc = editor.getDoc();

		initEditorSize(editorObj);

		exportInterface(editorObj);
		return editor;
	}

	function getEmptyLine(editor, lineNo) {
		lineNo = lineNo || editor.editor.getCursor().line || 0;

		var blockList = editor.getBlockList();
		if (blockList.length == 0){
			return 0;
		}

		var _getLineNo = function(lineNo) {
			if (editor.editor.getLine(lineNo) == undefined) {
				editor.editor.replaceRange("\n", {line:lineNo, ch:0});
			}

			return lineNo;
		}

		for (var i = 0; i < blockList.length; i++) {
			var block = blockList[i];
			if (i < blockList.length-1 && block.token.end < blockList[i+1].token.start && lineNo <= block.token.end) {
				return _getLineNo(block.token.end);
			
			}
			if (/^\n+$/.test(block.text)) {
				if (block.token.start <= lineNo && lineNo < block.token.end) {
					return _getLineNo(lineNo);
				}
				if (lineNo < block.start) {
					return _getLineNo(block.start);
				}
			} 
		}

		return _getLineNo(blockList[blockList.length-1].token.end);
	}

	function line_keyword_nofocus(editor, lineNo, content) {
		var originContent = editor.getLine(lineNo);
		var offsetX = originContent && originContent.length;
		editor.replaceRange(content, CodeMirror.Pos(lineNo, 0), CodeMirror.Pos(lineNo, offsetX));
	};

	function paste(editor, e) {
		if (!(e.clipboardData && e.clipboardData.items.length)) {
			console.log("该浏览器不支持操作");
			return;
		}
		for (var i = 0; i < e.clipboardData.items.length; i++) {
			var item = e.clipboardData.items[i];
			if (item.kind === "string") {

			} else if(item.kind === "file") {
				var pasteFile = item.getAsFile();
				pasteFile.name = undefined;
				pasteFile.filename = (new Date()).getTime();
				file_upload(editor, pasteFile);
			}
		}
	}

	function file_upload(editor, file) {
		console.log(file);
		var edit = editor.editor;
		var fileReader = new FileReader();
		var cursor = edit.getCursor();
		var insertLineNum = getEmptyLine(editor, cursor.line);
		console.log(cursor, insertLineNum);
		fileReader.onloadstart = function() {
			var onloadInfo = "***正在获取文件 0/"+ file.size +"***";
			console.log(onloadInfo);
			line_keyword_nofocus(edit, insertLineNum, onloadInfo);
		}
		fileReader.onprogress = function(f) {
			var onprogressInfo = "***正在获取文件 "+ f.loaded +"/" + file.size  + "***";
			console.log(onprogressInfo);
			line_keyword_nofocus(edit, insertLineNum, onprogressInfo);
		}
		fileReader.onload = function() {
			console.log("upload file to server");
			file.content = fileReader.result;
			editor.options.fileUpload(file, function(url){
				url = url || "";
				if (/image\/\w+/.test(file.type)) {
					line_keyword_nofocus(edit, insertLineNum, '!['+ (file.filename || file.name) + '](' + url + ")");
				} else {
					line_keyword_nofocus(edit, insertLineNum, '[' + (file.filename || file.name) + '](' + url + ")");
				}
			}, function(){
				line_keyword_nofocus(edit, insertLineNum, '');
			})
		}
		fileReader.readAsDataURL(file);
	}

	function fileUpload(editor, e) {
		e.preventDefault();
		if (!editor.options.fileUpload || !FileReader || !e.dataTransfer || e.dataTransfer.files.length == 0)  {
			console.log("file upload failed", FileReader);
			return;
		}

		var files = e.dataTransfer.files;
		for (var i = 0; i < files.length; i++) {
			file_upload(editor, files[i]);
		}
	}

	function initEditorSize(editorObj) {
		var height = $(editorObj.selector).css("height");
		editorObj.editor.setSize("100%", height);
		editorObj.editorPreview.css("width", "100%");
		editorObj.editorPreview.css("height", height);
		setPreviewScale(editorObj);
	}

	function font_style(editorObj, leftChar, rightChar) {
		var editor = editorObj.editor;
		if (editor.somethingSelected()) {
			var sel = editor.getSelection();
			var desStr = leftChar + sel.replace(/\n/g, rightChar + "\n" + leftChar) + rightChar;
			editor.replaceSelection(desStr);
		} else {
			var cursor = editor.getCursor();
			var content = editor.getLine(cursor.line);

			editor.replaceRange(rightChar, CodeMirror.Pos(cursor.line, content.length), CodeMirror.Pos(cursor.line, content.length));
			editor.replaceRange(leftChar, CodeMirror.Pos(cursor.line, 0), CodeMirror.Pos(cursor.line, 0));
			editor.setCursor(CodeMirror.Pos(cursor.line, content.length + leftChar.length));
		}
		editor.focus();
	}


	function getKeyMap(editorObj) {
		// 字体样式
		return {
			"Ctrl-S": function(cm) {
				editorObj.options.save && editorObj.options.save();
			},
			"Ctrl-B": function(cm) {
				font_style(editorObj, "**", "**");
			}, 
			"Ctrl-I": function(cm) {
				font_style(editorObj, "*", "*");
			},
			"Ctrl--": function(cm) {
				font_style(editorObj, "---", "");
			},
			"Shift-Ctrl-.": function(cm) {
				font_style(editorObj, "> ", "");
			},
			"Shift-Ctrl-8": function(cm) {
				font_style(editorObj, "* ", "");
			},
			"Shift-Ctrl-1": function(cm) {
				font_style(editorObj, "# ", "");
			},
			"Shift-Ctrl-2": function(cm) {
				font_style(editorObj, "## ", "");
			},
			"Shift-Ctrl-3": function(cm) {
				font_style(editorObj, "### ", "");
			},
			"Shift-Ctrl-4": function(cm) {
				font_style(editorObj, "#### ", "");
			},
			"Shift-Ctrl-5": function(cm) {
				font_style(editorObj, "##### ", "");
			},
			"Shift-Ctrl-6": function(cm) {
				font_style(editorObj, "###### ", "");
			},
			"Ctrl-Home": function(cm) {
				cm.setCursor(CodeMirror.Pos(0));
			},
			"Ctrl-End":function(cm) {
				cm.setCursor(CodeMirror.Pos(cm.lastLine()));
			},
		}
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
			setPreviewScale(editor);
		};
		var mouseupEvent = function(){
			editor.editorContainer.off("mouseup mouseleave", mouseupEvent);
			editor.editorContainer.off("mousemove", mousemoveEvent);
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

			editor.options.viewChange && editor.options.viewChange();
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
		//scaleY = scaleY || (previewHeight / scaleHeight);

		//console.log(scaleWidth);
		editor.editorPreview.css("width", scaleWidth + "px");
		//editor.editorPreview.css("height", scaleHeight + "px");
		//editor.editorPreview.css("transform", 'scale(' + scaleX + ',' + scaleY +')');
		editor.editorPreview.css("transform", 'scale(' + scaleX + ',' + scaleX +')');
		//editor.editorPreview.css("transform", 'scale(' + scaleX + ',' + 1 +')');
		editor.editorPreview.css("transform-origin", 'left top');

		editor.editorPreviewScaleX = scaleX;
		//editor.editorPreviewScaleY = scaleY;
		editor.editorPreviewScaleY = scaleX;
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
			if (!block) {
				return;
			}
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
			if (!block) {
				return;
			}
			editor.editor.scrollTo(0, editor.editor.getScrollInfo().top + editor.editor.heightAtLine(block.token.start) - initHeight);
			editor.scrollTimer = undefined;
		}, 100);
	}

	// 编辑器内容改变处理
	function change(editor){
		var text = editor.editor.getValue();
		if (!editor.currentFilename) {
			storage.sessionStorageSetItem("cmeditor_temp_content", text);
		}

		//console.log(text);
		editor.md.render(text);

		setPreviewScale(editor);

		editor.options.change && editor.options.change(editor.currentFilename, text);
	}

	// 导出编辑器接口
	function exportInterface(editor) {
		editor.setViewMode = function(showSource, showPreview) {
			if (!showSource && !showPreview) {
				return;
			}
			if (showSource && showPreview) {
				editor.editorSourceContainer.width("50%");
				editor.editorPreviewContainer.width("50%");
				editor.editorSourceContainer.show();
				editor.editorPreviewContainer.show();
			} else if (showSource && !showPreview) {
				editor.editorSourceContainer.width("100%");
				editor.editorPreviewContainer.width(0);
				editor.editorSourceContainer.show();
				editor.editorPreviewContainer.hide();
			} else if(!showSource && showPreview) {
				editor.editorSourceContainer.width(0);
				editor.editorPreviewContainer.width("100%");
				editor.editorSourceContainer.hide();
				editor.editorPreviewContainer.show();
			}
			setPreviewScale(editor);
		}
		editor.showSource = function() {
			editor.editorSourceContainer && editor.editorSourceContainer.show();
		}
		editor.hideSource = function() {
			editor.editorSourceContainer && editor.editorSourceContainer.hide();
		}
		editor.showPreview = function() {
			editor.editorPreviewContainer && editor.editorPreviewContainer.show();
		}
		editor.hidePreview = function() {
			editor.editorPreviewContainer && editor.editorPreviewContainer.hide();
		}
		editor.setValue = function(text) {
			editor.editor.setValue(text);
		}
		editor.getValue = function() {
			return editor.editor.getValue();
		}
		editor.setPreviewScale = function(scaleX, scaleY) {
			setPreviewScale(editor, scaleX, scaleY);
		}
		editor.setOptions = function(options) {
			editor.options = angular.merge(editor.options, options || {});
		}
		editor.swapDoc = function(filename, text) {
			if (filename) {
				if (!editor.docMap[filename]) {
					editor.docMap[filename] = CodeMirror.Doc(text, 'markdown');
				}
				editor.editor.swapDoc(editor.docMap[filename]);
			} else {
				editor.editor.swapDoc(editor.originDoc);
			}
			editor.currentFilename = filename;
			if (text) {
				editor.editor.setValue(text);
			} else {
				CodeMirror.signal(editor.editor, "change", editor.editor);
			}
		}
		editor.on = function(eventName, callback){
			editor.editor.on(eventName, function(cm){
				callback && callback(editor);
			});
		}
		editor.getBlockList = function() {
			return editor.md.getBlockList();
		}
		editor.getEmptyLine = function(lineNo) {
			return getEmptyLine(editor, lineNo)
		}
	}

	// codemirror editor constructor
	function cmeditor(options) {
		options = options || {};
		var editor = {
			docMap: {},
			selector: options.selector, 
			$scope: options.$scope,
			options: options,
		};

		editor.keyMap = angular.merge(getKeyMap(editor), options.keyMap || {}),

		//if (!editor.editor) {
			//console.log("编辑器创建失败...");
			//return;
		//}
		editor.editor = initEditor(editor);
		editor.md = mdwiki({
			containerId: "kp-editor-preview",
			editor: editor,
			mode: config.CONST.MD_MODE_EDITOR,
		});

		var text = storage.sessionStorageGetItem("cmeditor_temp_content") || ("");
		editor.editor.setValue(text);
		return editor;
	}

	return cmeditor;
});
