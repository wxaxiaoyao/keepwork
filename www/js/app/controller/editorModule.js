
define([
	"app",
	'text!html/controller/editorModule.html',
], function(app, htmlContent){

	app.registerController("editorModuleController", ["$scope", function($scope){

	}]);


	return htmlContent;
})
