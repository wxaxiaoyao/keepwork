

define([
	'app',
	'text!html/controller/group.html',
], function (app, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("groupController",['$scope', function ($scope) {
		var $auth = app.ng_objects.$auth;
		
		$scope.levelList = [{
			level:10,
			name: "拒绝",
		}, {
			level:20,
			name:"只读",
		}, {
			level:30,
			name:"读写",
		}, {
			level:40,
			name:"完全控制",
		}, {
			level:50,
			name:"所属",
		}];

		$scope.clickDeleteGroupUserBtn = function(user, group) {
			util.http("POST", config.apiUrlPrefix + "group_user/delete_group_membername", user, function(){
				getGroupUser(group);
			})
		}
		$scope.clickSetGroupUserBtn = function(member, index) {
			$scope.member = member || {};
			//if (index) {
				//$("#setGroupUserId_" + index).collapse("show");
			//}
			$("#newGroupId").collapse("hide");
		}
		$scope.clickSubmitMember = function(group) {
			var params = {
				username: group.username,
				group_id: group.group_id,
				groupname: group.groupname,
				membername: $scope.member.membername,
				level: $scope.member.level,
			}
			util.http("POST", config.apiUrlPrefix + "group_user/set_group_user", params, function() {
				getGroupUser(group);
			});
		}

		$scope.clickDeleteGroupBtn = function(group, $event) {
			if ($event) {
				$event.stopPropagation();
			}

			util.http("POST", config.apiUrlPrefix + "group/delete_group", group, function(){
				getUserGroup();
			});
		}

		$scope.clickSubmitGroup = function() {
			console.log($scope.group);
			util.http("POST", config.apiUrlPrefix + "group/set_group", $scope.group, function(){
				getUserGroup();
			}, function(){

			});
		}

		$scope.clickGroupMemberList = function(x) {
			//console.log(x);	
			getGroupUser(x);
		}

		$scope.getLevelName = function(level) {
			for (var i = 0; i < $scope.levelList.length; i++) {
				if ($scope.levelList[i].level == level) {
					return $scope.levelList[i].name;
				}
			}

			return "unknow";
		}

		$scope.clickJoinGroupBtn = function() {
			getJoinGroup();
		}

		// 获取组用户列表
		function getGroupUser(group) {
			util.http("GET", config.apiUrlPrefix + "group_user/get_by_user_group_name", {
				groupname:group.groupname,
			}, function(data) {
				group.userList = data || [];
			});
		}
		// 获取用户组列表
		function getUserGroup() {
			util.http("GET", config.apiUrlPrefix + "group/get", {}, function(data){
				$scope.myGroupList = data || [];
			});
		}

		// 获取加入的组列表
		function getJoinGroup() {
			util.http("GET", config.apiUrlPrefix + "group_user/get_by_membername", {}, function(data){
				$scope.joinGroupList = data || [];
			});
		}
		function init() {
			getUserGroup();	
		}

		$scope.$watch("$viewContentLoaded", function(){
			init();
		})
	}]);

	return htmlContent;
});
