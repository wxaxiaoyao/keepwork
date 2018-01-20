({
	appDir: "www",
	dir:"www_build",
	baseUrl:'.',
	optimizeCss: 'standard',
	removeCombined:true,
	optimizeAllPluginResources: true,  // text 插件配置
	skipDirOptimize: true,
	findNestedDependencies: true,
	generateSourceMaps: true,
	modules:[
	{
		name:"js/main",
		include : [
		],
	},
	],
	paths: {
		'jquery': 'js/lib/jquery/jquery.min',
		'bootstrap': 'js/lib/bootstrap/js/bootstrap.min',
		'angular': 'js/lib/angular/angular.min',
		'angular-ui-bootstrap': 'js/lib/angular-ui-bootstrap/ui-bootstrap-tpls',
		'satellizer': 'js/lib/satellizer/satellizer.min',
		'markdown-it': 'js/lib/markdown-it/markdown-it.min',  // 已支持amd则不能喝<script>标签混合使用
		'highlight': 'js/lib/highlight/highlight.pack', //不支持amd规范可用标签引入 或配置shim
		'js-base64': 'js/lib/js-base64/base64.min',
		'text': 'js/lib/requirejs/text',
		'domReady': 'js/lib/requirejs/domReady',
		'cropper': 'js/lib/cropper/cropper.min',

		'lib': 'js/lib',
		'css': 'assets/css',
		'app': 'js/app',
		'controller': 'js/app/controller',
		'directive': 'js/app/directive',
		'helper': 'js/app/helper',
		'wikimod': 'js/mod'
	},
	shim: {
		'bootstrap':{
			deps:['jquery']
		},
		'angular': {
			deps:['bootstrap'],
			exports: 'angular'
		},
		'angular-ui-bootstrap': {
			deps:['angular']
		},
		'satellizer':{
			deps:['angular']
		},
		'highlight':{
			exports: 'hljs'
		},
	},
	packages: [
		{
			name: "codemirror",
			location: "js/lib/codemirror",
			main: "lib/codemirror"
		}
	]
})
