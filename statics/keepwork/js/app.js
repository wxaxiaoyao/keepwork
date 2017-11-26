/**
 * Created by Administrator on 2017/11/26.
 */

define([
    "js/config",
    'angular',
    'angular-ui-bootstrap',
    'satellizer',
], function (config, angular) {
    var app = config.get("app");

    app.get = config.get;
    app.appName = "keepwork";

    app.ng_app = angular.module(app.appName, ['ui.bootstrap', 'satellizer']).run(function () {
        app.angularBootstrap = true;
    });

    app.ng_app.config(['$controllerProvider', '$authProvider', function ($controllerProvider, $authProvider) {
        // 提供动态注册控制器接口
        app.ng_app.registerController = function (name, constructor) {
            if (app.angularBootstrap) {
                $controllerProvider.register(name, constructor);
            } else {
                app.controller(name, constructor);
            }
        };
    }]);

    app.bootstrap = function () {
        angular.bootstrap(document, [app.appName]);
    }

    window.app = app;
    return app;
});