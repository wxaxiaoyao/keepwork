
define([
	"app",
	"modeditor/tag",
	"text!html/controller/modeditor.html",
], function(app, tagFactory, htmlContent){

	app.registerController("modeditorController", ["$scope", function($scope){
		var $rootScope = app.ng_objects.$rootScope;
		var tag = tagFactory("div");

		$rootScope.isShowFooter = false;
		$scope.tag = tag;

		function init(){
			tag.attrs.style.height = "100%";


			$scope.style = tag.attrs.style;


			$(".attrInputContainer").find("input").change(function(e){
				console.log(e);
				renderBlock();
			});

			renderBlock();
		}

		function renderBlock() {
			var htmlStr = tag.html();
			console.log(htmlStr);
			$("#modeditorarea").html(htmlStr);


			$("#modeditorarea").find("*").click(function(e){
				console.log(e);
			});
		}

		$scope.styleChange = function(){
			console.log($scope.style);
			
			renderBlock();
		}

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
});
