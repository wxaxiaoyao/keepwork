
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

				$scope.imgsPath = $rootScope.imgsPath;

				function render() {
					if (content) {
						$element.html($compile(content)($scope));
						return;
					}

					if (!contentUrl) {
						return;
					}

					//console.log(contentUrl);

					var urlobj = util.parseUrl(contentUrl);
					if (!urlobj.username || urlobj.username == "www" || !urlobj.pagename) {
						var ctrlPath = "controller/";
						if (urlobj.username != "www") {
							ctrlPath = ctrlPath + "user";
						} else if(urlobj.pagename) {
							var pagename = urlobj.pagename;
							for (var i = 0; i < pagename.length; i++) {
								if (pagename[i] == "/"  && (i+1) < pagename.length) {
									ctrlPath += pagename[i+1].toUpperCase();
									i++;
									continue;
								}
								ctrlPath += pagename[i];
							}
						} else {
							ctrlPath = ctrlPath + "home"; // 默认页
						}
						require([
							ctrlPath,
						], function(content) {
							$element.html($compile(content)($scope));
							$scope.$apply();
						});
					} else {
						var url = urlobj.url;
						util.$http({
							url:config.apiUrlPrefix + 'page/get_content_by_path',
							method:"GET",
							params: {
								path: url.substring(1) + ".md",
							},
							success:function(data) {
								if (!data) {
									return;
								}
								var md = mdwiki();
								var htmlstr = md.render(data);
								$element.html($compile(htmlstr)($scope));
								util.$apply($scope);
							},
							error: function() {

							}
						})
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
