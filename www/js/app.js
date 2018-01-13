/**
 * Created by Administrator on 2017/11/26.
 */

define([
    'angular',
    'angular-ui-bootstrap',
    'satellizer',
], function (angular) {
	var app = {};
    app.appName = "keepwork";
	app.objects = {};
    app.ng_objects = {
        controller_map:{},
        directive_map:{},
        component_map:{},
    };

    // 定义angular app模块
    app.ng_app = angular.module(app.appName, ['ui.bootstrap', 'satellizer']).run(["$injector", function($injector) {
        app.angularBootstrap = true;
		app.ng_objects.$injector = $injector;
		app.ng_objects.$rootScope = $injector.get("$rootScope");
		app.ng_objects.$compile = $injector.get("$compile");
		app.ng_objects.$http = $injector.get("$http");
		app.ng_objects.$auth = $injector.get("$auth");
		app.ng_objects.$timeout = $injector.get("$timeout");
    }]);

	//ng_app = app.get("app.ng_app", ng_app);
    // angular配置

    app.ng_app.config([
			'$controllerProvider',
		   	'$compileProvider',
		   	'$locationProvider',
			'$authProvider',
			'$sceDelegateProvider',
		   	function (
				$controllerProvider, 
				$compileProvider, 
				$locationProvider, 
				$authProvider,
				$sceDelegateProvider) {
				
				app.ng_objects.$controllerProvider = $controllerProvider;
				app.ng_objects.$compileProvider = $compileProvider;
				app.ng_objects.$locationProvider = $locationProvider;
				app.ng_objects.$authProvider = $authProvider;
				app.ng_objects.$sceDelegateProvider = $sceDelegateProvider;

				//$sceDelegateProvider.resourceUrlWhitelist([
					//"http://gitlab.com", 
					//"http://gitapi.localhost",
				//]);

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

    // 注册控指令
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
			"helper/storage",
			"helper/config",
			"helper/util",
			"helper/md/mdconf",
			"helper/mdwiki",
			"helper/dataSource/dataSource",

			"directive/wikipage",
			"directive/notify",

			"controller/main",
			//'directive/treeview',
        ], function (storage, config, util, mdconf, mdwiki, dataSource) {
			app.objects.storage = storage;
			app.objects.config = config;
			app.objects.util = util;
			app.objects.mdconf = mdconf;
			app.objects.mdwiki = mdwiki;
			app.objects.dataSource = dataSource;

            angular.bootstrap(document, [app.appName]);
        });
    }

	// 获取用户信息
	app.getUser = function(success, error) {
		var $auth = app.ng_objects.$auth;
		var storage = app.objects.storage;
		var util = app.objects.util;
		var config = app.objects.config;
		if (!$auth.isAuthenticated()) {
			error && error();
			return;
		}
		var authUseinfo = $auth.getPayload();
		var userinfo = app.objects.user || storage.sessionStorageGetItem("userinfo");
		if (userinfo && authUseinfo && userinfo.username == authUseinfo.username) {
			app.setUser(userinfo);
			success && success(userinfo);
			return;
		}
		
		util.$http({
			url: config.apiUrlPrefix + "user", 
			method: "GET",
			success: function(data) {
				if (data) {
					app.setUser(data);
					success && success(data);	
				}
			},
			error: error,
		});

		return userinfo;
	}
	// 设置用户信息
	app.setUser = function(userinfo) {
		var $rootScope = app.ng_objects.$rootScope;
		var storage = app.objects.storage;
		app.objects.user = $rootScope.user = userinfo;

		if (userinfo.default_data_source) {
			app.objects.git = app.objects.dataSource(userinfo.default_data_source);
		}

		//$rootScope.$broadcast("userinfo", userinfo);
		storage.sessionStorageSetItem("userinfo", userinfo);	
	}


    window.app = app;
    return app;
});
