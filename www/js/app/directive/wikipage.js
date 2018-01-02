
define([
	"app",
], function(app) {
	app.registerDirective("wikipage", ["$compile", function($compile){
		var util = app.objects.util;
		var config = app.objects.config;
		var mdwiki = app.objects.mdwiki;
		return {
			restrict:"E",
			scope: true,
			//template:'<input ng-model="message"><div>{{message}}</div>',
			controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs){
				var content, contentUrl;
				var $rootScope = app.ng_objects.$rootScope;
				var $auth =app.ng_objects.$auth;
				$scope.imgsPath = $rootScope.imgsPath;

				function render() {
					if (content) {
						$element.html($compile(content)($scope));
						return;
					}

					if (!contentUrl) {
						return;
					}
				}

				$scope.$watch($attrs.content, function(newVal) {
					if (!newVal || newVal == content) {
						return;
					}
					content = newVal;
					render();
				});
				$scope.$watch($attrs.contentUrl, function(newVal) {
					if (!newVal || newVal == contentUrl) {
						return;
					}
					contentUrl = newVal;
					render();
				});
			}],
		}
	}]);
});
