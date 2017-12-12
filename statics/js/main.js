/**
 * Created by wuxiangan on 2016/12/19.
 */

'use strict';

(function (win) {
    var pathPrefix = "";
    var jsPathPrefix = pathPrefix + 'js/';
    var libPathPrefix = pathPrefix + 'js/lib/';
    var appPathPrefix = pathPrefix + 'js/app/';
    var helperPathPrefix = pathPrefix + 'js/app/helper/';

    requirejs.config({
        baseUrl:'',
        paths: {
            'jquery': libPathPrefix + 'jquery/jquery.min',
            'bootstrap': libPathPrefix + "bootstrap/js/bootstrap.min",
            'angular': libPathPrefix + 'angular/angular.min',
            'angular-ui-bootstrap': libPathPrefix + 'angular-ui-bootstrap/ui-bootstrap-tpls',
            'satellizer': libPathPrefix + 'satellizer/satellizer.min',
            'markdown-it':libPathPrefix + 'markdown-it/markdown-it.min',  // 已支持amd则不能喝<script>标签混合使用
            'highlight': libPathPrefix + 'highlight/highlight.pack', //不支持amd规范可用标签引入 或配置shim
            'js-base64': libPathPrefix + 'js-base64/base64.min',
            'text': libPathPrefix + 'requirejs/text',
            'domReady': libPathPrefix + 'requirejs/domReady',

			'lib': 'js/lib',
			'css': 'assets/css',
            'app':'js/app',
            'controller':'js/app/controller',
            'directive': 'js/app/directive',
            'helper':'js/app/helper',
            'wikimod':'js/mod',
        },
        shim: {
            'bootstrap':{
                deps:['jquery'],
            },
            'angular': {
                deps:['bootstrap'],
                exports: 'angular',
            },
            'angular-ui-bootstrap':{
                deps:['angular'],
            },
            'satellizer':{
                deps:['angular'],
            },
            'highlight':{
                exports: 'hljs',
            },
            'wangEditor': {
                deps:['jquery'],
            },
        },
        packages: [
            {
                name: "codemirror",
                location: libPathPrefix +"codemirror",
                main: "lib/codemirror"
            },
        ],
        deps:['bootstrap'],
        urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
        // urlArgs: "bust=" + (config.isLocal() ? ((new Date()).getTime()) : (config.bustVersion || '')),   //防止读取缓存，调试用
    });


    require(['domReady', 'app', 'controller/mainController'], function (domReady, app) {
        // ***在angular启动之前加载页面内容，目的是内容js完全兼容之前angular书写方式，否则angular启动后，之前书写方式很多功能失效***
        // 加载页面主体内容
        domReady(function () {
            app.bootstrap();
        });
    });
})(window);



