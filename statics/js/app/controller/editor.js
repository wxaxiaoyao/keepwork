/**
 * Created by Administrator on 2017/12/3.
 */

define([
    'app',
	'markdown-it',
	'helper/cmeditor',
	'helper/dataSource/gitlab',
	'text!html/controller/editor.html',
], function (app, markdownit, cmeditor, gitlab, htmlContent) {
	var $auth = app.ng_objects.$auth;
	var util = app.objects.util;
	var config = app.objects.config;
	// git数据源
	var git = gitlab();


	//function format
	app.registerController("editorController", ["$scope", "$compile", function($scope, $compile){
		function init() {
			var $rootScope = app.ng_objects.$rootScope;
			var $scope.user = $scope.user || $rootScope.user;
			var editor = cmeditor({selector:"#editor", $scope:$scope});

			$rootScope.isShowHeader = false;

			git.init($scope.user.default_data_source);

			git.getTree({
				recursive: true,
				isFetchAll: true,
				path: "xiaoyao_site",
			}, function(datas){

			});
		}


		$scope.$watch("$viewContentLoaded", function(){
			if ($auth.isAuthenticated()) {
				init();
			} else {
				util.go("/www/login");
			}
		});

	}]);

	return htmlContent;
	//return htmlContent;
})
