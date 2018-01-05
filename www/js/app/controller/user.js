
define([
	'app',
	'text!html/controller/user.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("userController",['$scope', function ($scope) {
		var $auth = app.ng_objects.$auth;
		var $rootScope = app.ng_objects.$rootScope;
		var urlobj = util.parseUrl();
		var username = urlobj.username;
		
		$scope.clickLatestRenewBtn = function() {
			if (!$scope.latestRenewList) {
				getLatestRenew();
			}
		}

		$scope.clickVisitHistoryBtn = function() {
			if (!$scope.visitHistoryList) {
				getVisitHistory();
			}
		}

		$scope.clickMyFavoriteBtn = function() {
			if (!$scope.favoriteList) {
				getFavorite();
			}
		}

		$scope.clickMyFollowsBtn = function() {
			if (!$scope.followsList) {
				getFollows();
			}
		}

		$scope.clickMyFansBtn = function() {
			if (!$scope.fansList) {
				getFans();
			}
		}

		// 获取用户粉丝
		function getFans() {
			util.http("GET", config.apiUrlPrefix + "fans/get_fans_by_username", {username:username}, function(data) {
				$scope.fansList = data || [];
			});
		}

		// 获取用户关注
		function getFollows() {
			util.http("GET", config.apiUrlPrefix + "fans/get_follows_by_username", {fans_username:username}, function(data){
				$scope.followsList = data || [];
			});
		}

		// 获取用户收藏
		function getFavorite() {
			util.http("GET", config.apiUrlPrefix + "favorite/get_by_username", {username:username}, function(data) {
				$scope.favoriteList = data || [];
			});
		}

		// 获取用户的访问历史
		function getVisitHistory() {
			util.http("GET", config.apiUrlPrefix + "visit_history/get_by_username", {username:username}, function(data) {
				$scope.visitHistoryList = data || [];
			});
		}
		// 获取最近更新列表
		function getLatestRenew() {
			util.http("GET", config.apiUrlPrefix + "page/get_renew_by_username", {username:username}, function(data){
				$scope.latestRenewList = data || [];	
			});
		}

		// 获取用户信息
		function getUserinfo() {
			util.http("GET", config.apiUrlPrefix + "user/get_by_username", {username:username}, function(data){
				$scope.userinfo = data || {};
			});
		}

		function init() {
			if (!username) {
				return;
			}
			getUserinfo();
			getLatestRenew();
		}

		$scope.$watch("$viewContentLoaded", init);

		$rootScope.$watch("user", function(user) {
			$scope.user = user;

			if (!username && user && user.username) {
				username = user.username;
				init();
			}
		});
	}]);

	return htmlContent;
});
