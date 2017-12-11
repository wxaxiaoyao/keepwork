/**
 * Created by Administrator on 2017/12/3.
 */

define([
    'app',
	'helper/mdwiki',
	'markdown-it',
    'codemirror',
	'text!html/editor.html',

    'codemirror/mode/markdown/markdown',
    // 代码折叠
    'codemirror/addon/fold/foldgutter',
    'codemirror/addon/fold/foldcode',
    'codemirror/addon/fold/markdown-fold',
    'codemirror/addon/fold/xml-fold',
    // 错误提示
    'codemirror/addon/lint/json-lint',
    'codemirror/addon/search/search',
    'codemirror/addon/dialog/dialog',
    'codemirror/addon/edit/continuelist',
    'codemirror/addon/search/searchcursor',
    'codemirror/addon/search/matchesonscrollbar',
    'codemirror/addon/search/jump-to-line',
    'codemirror/addon/scroll/annotatescrollbar',
    'codemirror/addon/display/fullscreen',
], function (app, mdwiki, markdownit, CodeMirror, htmlContent) {

	app.registerController("editorController", ["$scope", function($scope){
		function init() {
			editor = CodeMirror.fromTextArea(document.getElementById("source"), {
				mode: 'markdown',
				lineNumbers: true,
				theme: "default",
				//viewportMargin: Infinity,
				//绑定Vim
				//keyMap:"vim",
				//代码折叠
				lineWrapping: true,
				//indentUnit:1,
				//smartIndent:true,
				foldGutter: true,
			});

			editor.setSize("auto", "2000px");

			var md = markdownit();
			var wiki = mdwiki({containerId:"preview"});
			var content = localStorage.getItem("content") || "";
			window.wiki = wiki;
			editor.setValue(content);
			//$("#preview").html(wiki.render(content));
			wiki.render(content);
			$("#preview1").html(md.render(content));
			editor.on("change", function(cm, changeObj){
				content = editor.getValue();
				//console.log(md_special_char_escape(content));
				//console.log(md_special_char_unescape(md_special_char_escape(content)));
				localStorage.setItem("content", content);
				wiki.render(content);
				//$("#preview").html(wiki.render(content));
				$("#preview1").html(md.render(content));
				//setTimeout(function(){$scope.$apply()});
			});
		}

		$scope.$watch("$viewContentLoaded", init);

	}]);

	return htmlContent;
})
