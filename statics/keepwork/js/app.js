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

    // 定义angular app模块
    app.ng_app = angular.module(app.appName, ['ui.bootstrap', 'satellizer']).run(function () {
        app.angularBootstrap = true;
    });

    // angular配置
    app.ng_objects = {
        controller_map:{},
        directive_map:{},
        component_map:{},
    };

    app.ng_app.config(['$controllerProvider', '$compileProvider', '$locationProvider','$authProvider', function ($controllerProvider, $compileProvider, $locationProvider, $authProvider) {
        app.ng_objects.$controllerProvider = $controllerProvider;
        app.ng_objects.$compileProvider = $compileProvider;
		app.ng_objects.$locationProvider = $locationProvider;

		$locationProvider.html5Mode(true);
    }]);

    // 提供动态注册控制器接口
    app.registerController = function (name, constructor) {
        if (app.ng_objects.controller_map[name]) {
            return;
        }
        if (app.angularBootstrap) {
            app.ng_objects.$controllerProvider.register(name, constructor);
        } else {
            app.ng_app.controller(name, constructor);
        }
        app.ng_objects.component_map[name] = constructor;
    };

    // 注册组件
    app.registerComponent = function (name, option) {
        if (app.ng_objects.component_map[name]) {
            return;
        }
        if (app.angularBootstrap) {
            app.ng_objects.$compileProvider.component(name, option);
        } else {
            app.ng_app.component(name, option);
        }
        app.ng_objects.component_map[name] = option;
    }

    // 注册控制器
    app.registerDirective = function(name, directiveFactory) {
        if (app.ng_objects.directive_map[name]) {
            return;
        }
        if (app.angularBootstrap) {
            app.ng_objects.$compileProvider.directive(name, directiveFactory);
        } else {
            app.ng_app.directive(name, directiveFactory);
        }
        app.ng_objects.directive_map[name] = directiveFactory;
    }



    // 判断控制器，指令，组件是否存在
    // app.has = function(typ, name) {
    //     return app.ng_objects[type][name];
    // }

    // 启动框架
    app.bootstrap = function () {
        require([
            "directive/wikiblock",
            "js/app/controller/mainController",
        ], function () {
            angular.bootstrap(document, [app.appName]);
        });
    }




    window.app = app;
    return app;
});
