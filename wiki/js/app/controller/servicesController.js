/**
 * Created by wuxiangan on 2017/3/9.
 */


define(['app',
    'helper/util',
    'helper/storage',
    'text!html/services.html',
], function (app, util, storage, htmlContent) {
    app.registerController('servicesController', ['$scope', 'Account', 'Message', 'github', function ($scope, Account, Message) {
        $scope.showItem = "myVIP";

        // 订单中心
        $scope.clickOrders = function () {
            $scope.showItem = 'orders';

            util.http("POST", config.apiUrlPrefix + "user_service/getByUsername", {username:$scope.user.username}, function (data) {
                $scope.serviceList = data.serviceList;
            }, function (err) {
                console.log(err);
            });

            $scope.renew = function (service) {
                if (service.name == "VIP"){
                    util.go("vip");
                }
            }
        };

        // 消费记录
        $scope.showMyPay = function () {
            $scope.showItem = 'myPay';
            $scope.payStatus = { "InProgress": "进行中", "Finish": "已完成", "Fail": "失败" };

            util.http("POST", config.apiUrlPrefix + "pay/getTrade", {}, function (data) {
                $scope.myPays = data;
            });

            util.http("GET", config.apiUrlPrefix + "wallet/getBalance", {}, function (data) {
                if (data) {
                    $scope.balance = data.balance;
                } else {
                    $scope.balance = 0;
                }
            });
        };

        $scope.showMyVIP = function () {
            $scope.showItem = 'myVIP';
        };

        $scope.goPayPage = function() {
            util.go("vip");
        };

        $scope.$on('userCenterSubContentType', function (event, item) {
            if (item == 'orders')
                $scope.clickOrders();
            else if(item == 'myPay')
                $scope.showMyPay();
            else if(item == 'myVIP'){
                $scope.showMyVIP();
            }
        });

        function init(userinfo) {
            $scope.user = userinfo || $scope.user;
        }

        // 文档加载完成
        $scope.$watch('$viewContentLoaded', function(){
            Account.ensureAuthenticated(function () {
                Account.getUser(function (userinfo) {
                    init(userinfo);
                });
            });
        });
    }]);

    return htmlContent;
});
