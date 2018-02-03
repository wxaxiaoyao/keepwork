
define([
	"app",
	"text!html/controller/footer.html",
], function(app, htmlContent) {
	
	app.registerController("footerController", ["$scope", function($scope){

	}]);

	return htmlContent;
});
