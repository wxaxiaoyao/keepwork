
define([
	'app',
	'controller/header',
], function (app, headerContent) {
	app.registerController("mainController",['$scope', function ($scope) {
		var util = app.objects.util;
		var config = app.objects.config;
		var mdwiki = app.objects.mdwiki;
		var $rootScope = app.ng_objects.$rootScope;
		var $auth = app.ng_objects.$auth;
		$rootScope.isShowHeader = true;
		$rootScope.isShowFooter = true;
		$rootScope.headerContent = headerContent;
		$rootScope.imgsPath = "assets/imgs/";
		
		function init(){
			$rootScope.loadContent = loadContent;

			util.replaceState({url:util.getAbsoluteUrl()});
		}

		function loadContent(contentUrl) {
			// 后端返回， 兼容搜索引擎
			var text = $("#noscriptId").text();
			if (text) {
				var md = mdwiki();
				var htmlstr = md.render(text);
				console.log(htmlstr);
				$element.html($compile(htmlstr)($scope));
				util.$apply($scope);
				$("#noscriptId").html("");
				return;
			}

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
					$rootScope.content = content;
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
						if (!data) {
							return;
						}
						var theme = data.theme || {};
						var content = data.content;
						var data_source = data.data_source;
						var htmlstr = md.render(content, theme.content);
						$element.html($compile(htmlstr)($scope));
						util.$apply($scope);
					},
					error: function() {

					}
				})
			}
		}

		app.getUser(function(userinfo){
			init();
		}, function(){
			init();
		});

		//var urlObj = util.parseUrl();
		//console.log(urlObj);
		//util.replaceState()
		//if (!urlObj.username || urlObj.username == "www") {
			//var controllerName = "controller/" + (urlObj.sitename || "test") + "Controller";
			//require([
				//controllerName,
			//], function(htmlContent){
				//$scope.content = htmlContent;
				//$scope.$apply();
			//});
		//}
	}]);
});
