
define([
	'app',
	'text!html/controller/test.html',
], function (app, htmlContent) {
    app.registerController("testController",['$scope', function ($scope) {
		var toolbase = app.objects.toolbase;
		
		var sender = Object.assign({name:"sender"}, toolbase);

		sender.addEvent("signal");

		sender.addEventListener("signal", function(){
			console.log("------");
		});

		sender.dispatchEvent("signal");
		console.log(sender);
	}]);

	return htmlContent;
});
