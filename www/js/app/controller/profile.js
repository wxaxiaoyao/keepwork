
define([
	'app',
	'cropper',
	'text!html/controller/profile.html',
], function (app, cropper, htmlContent) {
	var util = app.objects.util;
	var config = app.objects.config;

    app.registerController("profileController", ['$scope', function ($scope) {
		var $auth =app.ng_objects.$auth;
		var $rootScope = app.ng_objects.$rootScope;

        function getResultCanvas(sourceCanvas) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var width = sourceCanvas.width;
            var height = sourceCanvas.height;

            canvas.width = width;
            canvas.height = height;
            context.beginPath();
            context.rect(0,0,width,height);
            context.strokeStyle = 'rgba(0,0,0,0)';
            context.stroke();
            context.clip();
            context.drawImage(sourceCanvas, 0, 0, width, height);

            return canvas;
        }


		console.log($scope);

		$scope.fileUpload = function(file) {
			console.log(file);

			if (!file.type.match("image.*")) {
				return false;
			}

			var portraitImg = $("#portraitId");
			var reader = new FileReader();
			var imgUrl = undefined;
			var filename = file.name;
			reader.readAsDataURL(file);
			reader.onload = function(arg) {
				imgUrl = arg.target.result;
				//portraitImg.attr("src", imgUrl);
				$scope.portrait = imgUrl;
				$scope.showPortraitConfirmBtn = true;
				$scope.$apply();
			}
			$scope.clickPortraitYesBtn = function() { 
				var git = app.objects.git;
				if (!git) {
					console.log("没有配置数据源");
					return;
				}
				
				git.uploadImage({path:filename, content:imgUrl}, function(url){
					console.log(url);
					$scope.user.portrait = url;
					$scope.clickSubmitUserInfoBtn();
					$scope.showPortraitConfirmBtn = false;
				},function() {
					$scope.showPortraitConfirmBtn = false;
				});
			}
			$scope.clickPortraitNoBtn = function() {
				$scope.portrait = undefined;
				$scope.showPortraitConfirmBtn = false;
			}
		}
		$scope.clickSubmitUserInfoBtn = function() {
			util.http("POST", config.apiUrlPrefix + "user/update_by_username", $scope.user, function(){
				app.setUser($scope.user);
				$scope.msgContent = "用户信息修改成功";
			});
		}

		$scope.clickSubmitPasswordBtn = function() {
			var pwd = $scope.pwd;

			function isValidPassword(password) {
				if (!password) {
					return false;
				}

				var len = password.length;
				if (len< 6 || len > 30) {
					return false;
				}

				return true;
			}

			if (!isValidPassword(pwd.oldpassword) || !isValidPassword(pwd.newpassword) || !isValidPassword(pwd.newpassword2) || pwd.newpassword != pwd.newpassword2) {
				console.log("密码不合规范或两次新密码不一致");
				return;
			}
			console.log($scope.pwd);
			util.http("POST", config.apiUrlPrefix + 'user/changepw', pwd, function(){
				console.log("密码修改成功");
			});

		}
		$rootScope.$watch("user", function(user){
			$scope.user = user;
		});
	}]);

	return htmlContent;
});
