
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

				function noscript() {
					var text = $("#noscriptId").text();
					if (!text) {
						return false;
					}
					var md = mdwiki();
					var htmlstr = md.render(text);
					console.log(htmlstr);
					$element.html($compile(htmlstr)($scope));
					util.$apply($scope);
					$("#noscriptId").html("");

					return true;
				}

				function renderMDContent(content , theme) {
					var md = mdwiki();
					var htmlstr = md.render(content, content);
					$element.html($compile(htmlstr)($scope));
					util.$apply($scope);
				}

				function loadContentByUrl(contentUrl) {
					var urlobj = util.parseUrl(contentUrl);
					if (!urlobj.username || urlobj.username == "www" || !urlobj.pagename) {
						var ctrlPath = "controller/";
						if (!urlobj.pagename) {
							if (urlobj.username == "www" || (!urlobj.username && !$auth.isAuthenticated())) {
								ctrlPath = ctrlPath + 'home';
							} else {
								ctrlPath = ctrlPath + "user";
							}
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
							util.$apply();
						});
					} else {
						var url = urlobj.url;
						util.$http({
							url:config.apiUrlPrefix + 'page/visit_by_url',
							method:"GET",
							params: {
								url: url.substring(1),
							},
							success:function(data) {
								if (!data || !data.data_source) {
									console.log("页面丢失");
									return;
								}
								var git = app.objects.dataSource(data.data_source);
								var theme = data.theme || {};
								var content = data.content;
								console.log(url);
								if (content) {
									renderMDContent(content, theme.content);
								} else {
									git.getContent({path:url.substring(1) + config.pageSuffix}, function(content){
										renderMDContent(content);
									}, function() {
										console.log("页面丢失");
									});
								}
							},
							error: function() {
								console.log("内部错误");
							}
						})
					}
				}

				function render() {
					//console.log("--------------", contentUrl);
					if (content) {
						$element.html($compile(content)($scope));
						return;
					}

					if (!contentUrl) {
						return;
					}

					loadContentByUrl(contentUrl);
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
