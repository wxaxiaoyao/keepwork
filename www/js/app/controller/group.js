

define([
	'app',
	'helper/dataSource/gitlab',
	'text!html/controller/group.html',
], function (app, gitlab, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;
	var storage = app.objects.storage;
	var git = gitlab();

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

		function getDefaultDataSource(success, error) {
			var dataSource = storage.sessionStorageGetItem("user_default_data_source");
			if (dataSource) {
				success && success(dataSource);
				return;
			}

			util.http("GET", config.apiUrlPrefix + "data_source/get_default_data_source", {}, function(data){
				if (!data) {
					error && error(data);
					return;
				}

				storage.sessionStorageSetItem("user_default_data_source", data);
				success && success(data);
			}, error);
		}

		function getFolderList() {
			function _getFolderList(node, list) {
				list = list || [];

				if (node.type == "tree") {
					list.push(node);
				} else {
					return list;
				}
				
				for (var i = 0; i < node.nodes.length; i++) {
					_getFolderList(node.nodes[i], list);
				}

				return list;
			}

			getDefaultDataSource(function(data) {
				git.init(data);
				git.getTree({
					recursive: true,
					isFetchAll: true,
					path: "xiaoyao",
				}, function(datas){
					console.log(datas);
					var node = datas[0];
					node.text = "我的页面";
					$scope.folderList = _getFolderList(node);
				}, function(){

				});
			});
		}

		function getFileGroupList() {
			util.http("GET", config.apiUrlPrefix + "file_group/get_by_username", {}, function(data){
				$scope.fileGroupList = data || [];
			});
		}

		function getUserGroupList() {
			util.http("GET", config.apiUrlPrefix + "group/get_all", {}, function(data){
				$scope.userGroupList = data;
			});
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

		$scope.clickFileGroupBtn = function() {
			getFolderList();
			getUserGroupList();
			getFileGroupList();
		}

		$scope.clickFileGroupNewBtn = function() {
			$scope.fileGroup = {};
		}
		$scope.clickFileGroupModifyBtn = function(fileGroup) {
			fileGroup.group = fileGroup.group_username + "/" + fileGroup.groupname;
			$scope.fileGroup = fileGroup;
			console.log($scope.fileGroup);
			//$("#newFileGroupId").collapse("show");
		}

		$scope.clickFileGroupDeleteBtn = function(fileGroup) {
			util.http("POST", config.apiUrlPrefix + "file_group/delete_by_id", fileGroup, function(){
				getFileGroupList();
			});	
		}

		$scope.clickFileGroupSubmitBtn = function() {
			var x = $scope.fileGroup;
			var groups = x.group.split("/");

			x.groupname = groups[1];
			x.group_username = groups[0];
			
			util.http("POST", config.apiUrlPrefix + "file_group/set_file_group", x, function(){
				getFileGroupList();
			}, function(){
				
			});
			console.log(x);
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
