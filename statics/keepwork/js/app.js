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

    app.ng_app.config(['$controllerProvider', '$compileProvider','$authProvider', function ($controllerProvider, $compileProvider, $authProvider) {
        app.ng_objects.$controllerProvider = $controllerProvider;
        app.ng_objects.$compileProvider = $compileProvider;
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

    // 注册一个扩展html指令
    app.registerDirective("kpHtml", ['$compile', function ($compile) {
        return function ($scope, $element, $attrs) {
            $scope.$watch(function ($scope) {
                return $scope.$eval($attrs.kpHtml);
            }, function (newVal) {
                $element.html(newVal);
                $compile($element.contents())($scope);
            });
        }
    }]);

    // 判断控制器，指令，组件是否存在
    // app.has = function(typ, name) {
    //     return app.ng_objects[type][name];
    // }

    // 启动框架
    app.bootstrap = function () {
        require([
            "js/app/controller/mainController",
        ], function () {
            angular.bootstrap(document, [app.appName]);
        });
    }


    // setTimeout(function () {
    //     app.registerComponent("helloWorld", {
    //         template: '<div>My name is {{name}}</div>',
    //         controller: ['$http','$scope', '$element', '$attrs', function($http, $scope, $element, $atts) {
    //             this.name = 'shahar';
    //             console.log($http);
    //             console.log($scope);
    //             console.log($atts);
    //             console.log($element);
    //             //$scope.name = "test";
    //         }],
    //     });
    //
    //     var $compile = app.ng_objects.$compile;
    //     var $rootScope = app.ng_objects.$rootScope;
    //     $("body").append($compile("<hello-world></hello-world>")($rootScope));
    //     $rootScope.$apply();
    //
    // }, 10000);
    app.registerComponent("wikiBlock", {
        template: '<div> My name is {{name}}</div><div kp-html="htmlContent"></div><div ng-transclude></div>',
        // transclude:true,
        controller: ['$http','$scope', '$element', '$attrs', function($http, $scope, $element, $atts) {
            this.name = 'shahar';
            console.log($http);
            console.log($scope);
            console.log($atts);
            console.log($element);
            $scope.name = "test";
            $scope.htmlContent = "this is test {{name}}";
        }],
    });

    window.app = app;
    return app;
});