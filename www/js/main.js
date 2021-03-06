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
			'jshashes': libPathPrefix + 'jshashes/hashes.min',
            'text': libPathPrefix + 'requirejs/text',
            'domReady': libPathPrefix + 'requirejs/domReady',
			'cropper': libPathPrefix + 'cropper/cropper.min',
			//"vue": libPathPrefix + 'vue/vue.min',
			"vue": libPathPrefix + 'vue/vue',
			"ELEMENT": libPathPrefix + "element-ui/index",
			"_": libPathPrefix + "lodash/lodash",

			'lib': pathPrefix + 'js/lib',
			'css': pathPrefix + 'assets/css',
            'app': pathPrefix + 'js/app',
            'controller': pathPrefix + 'js/app/controller',
            'directive': pathPrefix + 'js/app/directive',
            'component': pathPrefix + 'js/app/component',
            'helper': pathPrefix + 'js/app/helper',
            'wikimod': pathPrefix + 'js/mod',
			"modeditor": pathPrefix + 'js/app/modeditor',
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
			"ELEMENT":{
				deps:["vue"],
			},
        },
        packages: [
            {
                name: "codemirror",
                location: libPathPrefix +"codemirror",
                main: "lib/codemirror"
            },
        ],
		waitSeconds:20,
        urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
        // urlArgs: "bust=" + (config.isLocal() ? ((new Date()).getTime()) : (config.bustVersion || '')),   //防止读取缓存，调试用
    });


    require(['domReady', 'app'], function (domReady, app) {
        // ***在angular启动之前加载页面内容，目的是内容js完全兼容之前angular书写方式，否则angular启动后，之前书写方式很多功能失效***
        // 加载页面主体内容
        domReady(function () {
            app.bootstrap();
        });
    });
})(window);



