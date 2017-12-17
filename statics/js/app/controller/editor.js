/**
 * Created by Administrator on 2017/12/3.
 */

define([
    'app',
	'markdown-it',
	'helper/cmeditor',
	'text!html/controller/editor.html',
], function (app, markdownit, cmeditor, htmlContent) {

	app.registerController("editorController", ["$scope", "$compile", function($scope, $compile){
		function init() {
			var $rootScope = app.ng_objects.$rootScope;
			var editor = cmeditor({selector:"#editor", $scope:$scope});

			$rootScope.isShowHeader = false;

			//var md = markdownit();
			//var wiki = mdwiki({containerId:"preview"});
			//var content = localStorage.getItem("content") || "";
			//window.wiki = wiki;
			//editor.setValue(content);
			////$("#preview").html(wiki.render(content));
			//wiki.render(content);
			//$("#preview1").html(md.render(content));
			//editor.on("change", function(cm, changeObj){
				//content = editor.getValue();
				////console.log(md_special_char_escape(content));
				////console.log(md_special_char_unescape(md_special_char_escape(content)));
				//localStorage.setItem("content", content);
				//wiki.render(content);
			//});
		}

		$scope.$watch("$viewContentLoaded", init);

	}]);

	return htmlContent;
	//return htmlContent;
})
