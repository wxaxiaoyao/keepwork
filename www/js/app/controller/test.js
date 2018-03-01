
define([
	'app',
	'modeditor/tag',
	'text!html/controller/test.html',
], function (app, tagFactory, htmlContent) {
    app.registerController("testController",['$scope', function ($scope) {

		function init() {
			var elem1 = $(".editorContainer");
			var elem2 = $(".dragObj");

			var elemDom1 = elem1[0];
			var elemDom2 = elem2[0];

			var startEvent, endEvent;
			elemDom1.ondragenter = function(ev) {
				console.log(ev);
				console.log("dragenter");
			}

			elemDom1.ondragover = function(ev) {
				//console.log(ev);
				//console.log("dragover");
				ev.preventDefault();
			}

			elemDom1.ondrop = function(ev) {
				console.log(ev);
				console.log("drop");
				elem1.css("top")
			}
			elemDom2.ondragstart = function(ev) {
				console.log(ev);

				startEvent = ev;
			}

			elemDom2.ondragend = function(ev) {
				console.log(ev);

				endEvent = ev;

				var offsetX = endEvent.clientX - startEvent.clientX;
				var offsetY = endEvent.clientY - startEvent.clientY;

				var marginLeft = elem2.css("margin-left");
				var marginTop = elem2.css("margin-top");
				console.log(elem2);

				console.log(marginLeft);
				marginLeft = parseInt(marginLeft.substring(0, marginLeft.length-2));
				marginTop = parseInt(marginTop.substring(0, marginTop.length-2));
				marginLeft += offsetX;
				marginTop += offsetY;

				elem2.css("margin-left", marginLeft + "px");
				elem2.css("margin-top", marginTop + "px");
				console.log(marginLeft);
			}

		}

		$scope.$watch("$viewContentLoaded", init);
	}]);

	return htmlContent;
});
