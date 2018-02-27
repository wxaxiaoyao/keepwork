
define([
	'app',
	'modeditor/tag',
	'text!html/controller/test.html',
], function (app, tagFactory, htmlContent) {
    app.registerController("testController",['$scope', function ($scope) {
		var objectEvent = app.objects.objectEvent;
		var sender = Object.assign({name:"sender"}, objectEvent);
		var tag = tagFactory();



		sender.addEventListener("signal", function(){
			console.log("------");
		});

		sender.dispatchEvent("signal");
		console.log(sender);
	}]);

	return htmlContent;
});
