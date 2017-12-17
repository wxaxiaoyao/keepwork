
define([
	"app",
	"helper/util",
], function(app) {
	app.registerDirective("wikipage", ["$compile", function($compile){
		return {
			restrict:"E",
			scope: true,
			//template:'<input ng-model="message"><div>{{message}}</div>',
			controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs){
				var content, contentUrl;

				function render() {
					if (content) {
						$element.html($compile(content)($scope));
						return;
					}

					if (!contentUrl) {
						return;
					}

					var urlobj = util.parseUrl(contentUrl);
					if (!urlobj.username || urlobj.username == "www") {
						var ctrlPath = "controller/" + (urlobj.sitename || "test");
						require([
							ctrlPath,
						], function(content) {
							$element.html($compile(content)($scope));
							$scope.$apply();
						});
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
