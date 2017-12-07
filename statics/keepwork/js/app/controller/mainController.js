
define([
	'app',
	'helper/md',
	'codemirror',
    'helper/markdown',

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
], function (app, md, CodeMirror,  markdown) {
    app.registerController("mainController", ['$rootScope', '$compile','$scope', function ($rootScope, $compile, $scope) {
        app.ng_objects.$rootScope = $rootScope;
        app.ng_objects.$compile = $compile;


		function init() {
			editor = CodeMirror.fromTextArea(document.getElementById("source"), {
				mode: 'markdown',
				lineNumbers: true,
				theme: "default",
				viewportMargin: Infinity,
				//绑定Vim
				//keyMap:"vim",
				//代码折叠
				lineWrapping: true,
				indentUnit:1,
				smartIndent:true,

				foldGutter: true,

			});

			editor.setSize("auto", "2000px");

			md = md();
			var mdwiki = markdown();
			var content = localStorage.getItem("content") || "";
			console.log(content);
			editor.setValue(content);
			$("#preview").html(md.render(content));
			$("#preview1").html(mdwiki.md.render(content));
			//console.log(md_special_char_escape(content));
			//console.log(md_special_char_unescape(md_special_char_escape(content)));
			editor.on("change", function(cm, changeObj){
				content = editor.getValue();
				//console.log(md_special_char_escape(content));
				//console.log(md_special_char_unescape(md_special_char_escape(content)));
				localStorage.setItem("content", content);
				console.log(content);
				$("#preview").html(md.render(content));
				$("#preview1").html(mdwiki.md.render(content));
			});
		}

		$scope.$watch("$viewContentLoaded", init);
		}]);
});
