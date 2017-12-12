
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
			change(editorObj);
		});

		editor.on("scroll", function(cm) {
			sourceScroll(editorObj);
		});
		
		editorObj.editorPreview.on("scroll mouseenter mouseleave", function(e){
			previewScroll(editorObj, e);

		});

		var height = $(selector).css("height");
		editor.setSize("auto", height);
		editorObj.editorPreview.css("height", height);

		editorObj.editor = editor;
		return editor;
	}

	function getScaleSize(scroll) {
		return 1;
		//var winWidth = $(window).width();
		//var boxWidth = $("#preview").width();//30为#preview的padding宽度
		//var resultWidth=getResultSize(winWidth,boxWidth);
		//var scaleSize = boxWidth / resultWidth;
		//if(!scroll || scroll!="scroll"){
			//resizeResult(resultWidth);//设置result-html宽度

			//var len=$scope.scales.length-1;
			//if(!$scope.scales[len].resultWidth || ($scope.scales[len].resultWidth != winWidth && $scope.scales[len].showValue == "实际大小")){//设置实际大小的result-html的宽度为浏览器窗口大小宽度
				//$scope.scales[len].resultWidth = winWidth;
			//}
			//if($scope.scales[len].showValue!="适合宽度"){
				//$scope.scales.push({
					//"id":$scope.scales.length,
					//"showValue":"适合宽度",
					//"scaleValue":scaleSize,
					//"special":true,
					//"resultWidth":resultWidth
				//});
			//}else if ($scope.scales[len].showValue=="适合宽度" && $scope.scales[len].resultWidth!=resultWidth){
				//$scope.scales[len].resultWidth=resultWidth;
			//}else if ($scope.scales[len].showValue=="适合宽度" && $scope.scales[len].scaleValue!=scaleSize){
				//$scope.scales[len].scaleValue=scaleSize;
			//}
		//}
		//return scaleSize;
	}

	function getResultSize(winWidth, boxWidth){ 
		return resultSize = boxWidth < 1200 ? boxWidth : (winWidth > 1200 ? 1200 : winWidth);
	}

	function resizeResult(resultWidth) {
		if(resultWidth){
			$(".result-html").css("width", resultWidth + "px");
		}
	}
	// 代码滚动
	function sourceScroll(editor) {
		if (editor.isPreviewScroll)
			return;
		//console.log(scrollTimer);
		editor.scrollTimer && clearTimeout(editor.scrollTimer);
		editor.scrollTimer = setTimeout(function () {
			var scaleSize = getScaleSize("scroll");
			var initHegiht = editor.editor.getScrollInfo().top + editor.editor.heightAtLine(0);
			console.log(initHegiht);
			var index = 0;
			var block;
			var blockList = editor.md.template.blockList;
			for (index = 0; index < blockList.length - 1; index++) {
				block = blockList[index];
				if (block.isTemplate)
					continue;

				console.log(editor.editor.heightAtLine(block.token.start));
				if (editor.editor.heightAtLine(block.token.start) >= initHegiht)
					break;
			}
			block = blockList[index];
			editor.editorPreview.scrollTop(block.$element[0].offsetTop * scaleSize);
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
		editor.scrollTimer && clearTimeout(editor.scrollTimer);
		editor.scrollTimer = setTimeout(function () {
			var scaleSize = getScaleSize("scroll");
			var initHeight = editor.editor.getScrollInfo().top + editor.editor.heightAtLine(0);
			var index = 0, block, blockList = editor.md.template.blockList;
			var scrollTop = editor.editorPreview[0].scrollTop;
			for (index = 0; index < blockList.length - 1; index++) {
				block = blockList[index];
				if (block.isTemplate)
					continue;
				if (scrollTop <= block.$element[0].offsetTop * scaleSize) {
					break;
				}
			}
			block = blockList[index];
			editor.editor.scrollTo(0, editor.editor.getScrollInfo().top + editor.editor.heightAtLine(block.token.start) - initHeight);
			editor.scrollTimer = undefined;
		}, 100);
	}


	function change(editor){
		var text = editor.editor.getValue();
		storage.sessionStorageSetItem("cmeditor_temp_content", text);

		//console.log(text);
		editor.md.render(text);
	}
	// codemirror editor constructor
	function cmeditor(selector, $scope) {
		//var height = $(selector).css("height");
		var editor = {
			selector: selector, 
			$scope:$scope,
		};


		//if (!editor.editor) {
			//console.log("编辑器创建失败...");
			//return;
		//}
		editor.md = mdwiki({containerId: "editor-preview"});
		editor.editor = initEditor(editor);


		var text = storage.sessionStorageGetItem("cmeditor_temp_content") || ("");
		editor.editor.setValue(text);
		return editor;
	}

	return cmeditor;
});
