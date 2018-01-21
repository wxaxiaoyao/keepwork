
define([
	'app',
	'text!html/directive/notify.html',
], function(app, notifyHtml){
	app.registerDirective("notify", [function(){
		var $compile = app.ng_objects.$compile;
		var util = app.objects.util;
		var config = app.objects.config;
		var mdwiki = app.objects.mdwiki;

		return {
			restrict: "E",
			scope:true,
			template: notifyHtml,
			controller: ["$scope",'$element', '$attrs', function($scope, $element, $attrs){
				var containerElem = $element.children();
				var contentElem = containerElem.find(".kp-notify-content");

				$scope.notifyList = [];
				function hide() {
					containerElem.fadeOut(1000);
				}

				function show() {
					var content = $scope.$parent.$eval($attrs.content);
					if (!content) {
						return;
					}

					$scope.type = $scope.$parent.$eval($attrs.type) || "info";
					var html = "<div>" + content + "</div>";
					html = $compile(html)($scope);
					contentElem.html(html);
					containerElem.fadeIn(1000);
					setTimeout(hide, 2000);
				}

				$scope.$watch(function(){
					return $scope.$parent.$eval($attrs.content);
				}, function(value) {
					show();
				});
				//$scope.$watch(function(){
					//return $scope.$eval($attrs.type);
				//}, function(value) {
					//show();
				//});
			}],
		}
	}]);
})
