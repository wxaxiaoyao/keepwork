/**
 * Created by wuxiangan on 2017/3/21.
 */

define([
    'app',
    'helper/util',
    'helper/storage',
    'helper/dataSource',
    'text!wikimod/wiki/html/submitWorks.html',
    'cropper'
], function (app, util, storage, dataSource, htmlContent) {

    function getModParams(wikiblock) {
        var modParams = wikiblock.modParams || storage.sessionStorageGetItem("wikiModParams") || {};
        return angular.copy(modParams);
    }

    function registerController(wikiblock) {
        app.registerController('submitWorksController',['$scope', 'Account', 'Message', function ($scope, Account, Message) {
            $scope.imgsPath = config.wikiModPath + 'wiki/assets/imgs/';
            $scope.works = {};
            var modParams = getModParams(wikiblock);
            var userinfo = undefined;
            var siteinfo = undefined;

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

            function initImageUpload() {
                var finishBtn = $("#finish");
                var cropper = $("#cropper");
                var changeBtn=$(".change-btn");

                $scope.fileUpload = function (e) {
                    var file = e.target.files[0];
                    // 只选择图片文件
                    if (!file.type.match('image.*')) {
                        return false;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (arg) {
                        var croppedCanvas;
                        var resultCanvas;
                        finishBtn.removeClass("sr-only");
                        cropper.removeClass("sr-only");
                        changeBtn.addClass("sr-only");
                        var img = "<img src='" + arg.target.result + "' alt='preview' />";
                        cropper.html(img);
                        var $previews = $('.preview');
                        $('#cropper > img').cropper({
                            aspectRatio: 4 / 3,
                            viewMode: 1,
                            dragMode: 'move',
                            restore: false,
                            guides: false,
                            highlight: false,
                            cropBoxMovable: false,
                            cropBoxResizable: false,
                            minCropBoxWidth:280,
                            build:function(){
                                var $clone = $(this).clone().removeClass('cropper-hidden');
                                $clone.css({
                                    display: 'block',
                                    width:'320px',
                                    height:'240px'
                                });

                                $previews.css({
                                    overflow: 'hidden'
                                }).html($clone);
                            },
                            crop: function (e) {
                                var imageData = $(this).cropper('getImageData');
                                var previewAspectRatio = e.width / e.height;

                                $previews.each(function () {
                                    var $preview = $(this);
                                    var previewWidth = $preview.width();
                                    var previewHeight = previewWidth / previewAspectRatio;
                                    var imageScaledRatio = e.width / previewWidth;

                                    $preview.height(previewHeight).find('img').css({
                                        width: imageData.naturalWidth / imageScaledRatio,
                                        height: imageData.naturalHeight / imageScaledRatio,
                                        marginLeft: -e.x / imageScaledRatio,
                                        marginTop: -e.y / imageScaledRatio
                                    });
                                });

                                croppedCanvas=$(this).cropper('getCroppedCanvas');
                                resultCanvas=getResultCanvas(croppedCanvas);
                                $scope.imgUrl=resultCanvas.toDataURL();//产生裁剪后的图片的url
                            }
                        });
                    }
                };
                finishBtn.on("click", function () {
                    changeBtn.removeClass("sr-only");
                    cropper.html("");
                    cropper.addClass("sr-only");
                    finishBtn.addClass("sr-only");

                    var defaultDataSource = dataSource.getDefaultDataSource();
                    if (!defaultDataSource || !defaultDataSource.isInited()) {
                        Message.info("内部数据源失效");
                        return;
                    }
                    var imgUrl=$scope.imgUrl;
                    //console.log(imgUrl);
                    defaultDataSource.uploadImage({content:imgUrl}, function (url) {
                        $scope.works.worksLogo = url;
                    }, function () {
                        Message.info("站点图片上传失败!!!");
                    });
                });
            }

            function init() {
                initImageUpload();
                // 获取用户所有站点
                var finish = function () {
                    config.loading.hideLoading();
                };

                config.loading.showLoading();
                util.post(config.apiUrlPrefix + 'website/getAllByUserId', {userId: $scope.user._id}, function (data) {
                    var siteList = data || [];
                    var userDataSource = dataSource.getUserDataSource($scope.user.username);
                    $scope.pageList = [];
                    userDataSource.registerInitFinishCallback(function () {
                        var fnList = [];
                        for (var i = 0; i < siteList.length; i++) {
                            fnList.push((function (index) {
                                return function (cb, errcb) {
                                    var siteinfo = siteList[index];
                                    var DataSource = userDataSource.getDataSourceById(siteinfo.dataSourceId || $scope.user.dataSourceId);
                                    DataSource.getTree({path:'/' + siteinfo.username + '/' + siteinfo.name}, function (data) {
                                        $scope.pageList = $scope.pageList.concat(data || []);
                                        //console.log($scope.pageList);
                                        cb && cb();
                                    }, errcb)
                                }
                            })(i));
                        }

                        util.sequenceRun(fnList, undefined, finish, finish);
                    });
                }, finish);
            }

            // 提交作品
            $scope.clickSubmitWorks = function () {
                if (!siteinfo) {
                    Message.info("无权限提交!!!");
                    return;
                }
                $scope.works.websiteId = siteinfo._id;
                $scope.works.username = $scope.user.username;
                util.post(config.apiUrlPrefix + 'user_works/upsert', $scope.works, function (data) {
                    if (!data || !data._id) {
                        return;
                    }
                    util.post(config.apiUrlPrefix + "website_apply/worksApply", {
                        websiteId: siteinfo._id,
                        applyId: data._id,
                    }, function () {
                        var finish = function () {
                            window.history.back();
                        };
                        config.services.confirmDialog({title:"作品提交", content:"作品提交成功", cancelBtn:false}, finish, finish);
                    }, function () {
                        Message.info("作品提交失败...");
                    });
                });
                //console.log($scope.works);
            }

            $scope.clickCancelWorks = function () {
                window.history.back();
            }

            // 路径过滤
            $scope.worksUrlSelected = function ($item, $model) {
                $scope.works.worksUrl = $item.url;
            }

            $scope.$watch('$viewContentLoaded',function () {
                Account.getUser(function (userinfo) {
                    $scope.user = userinfo;
                    modParams.username = "xiaoyao";
                    modParams.sitename = "xiaoyao";
                    if (modParams.username && modParams.sitename) {
                        util.post(config.apiUrlPrefix + "website/getUserSiteInfo", {username:modParams.username, sitename:modParams.sitename}, function (data) {
                            userinfo = data.userinfo;
                            siteinfo = data.siteinfo;
                            userinfo && siteinfo && init();
                        });
                    }
                });
            });
        }]);
    }

    return {
        render: function(wikiblock){
            registerController(wikiblock);
            return htmlContent;
        }
    };
});

/*
```@wiki/js/submitWork
{
    "username":"keepwork",
    "sitename":"game",
}
```
 */