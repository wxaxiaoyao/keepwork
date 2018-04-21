module.exports = {
	srcDir: "client/",

	performance: {
		prefetch: false,
	},

	plugins: [
	//{src:"~/plugins/element-ui", ssr: false},
	//{src:"~/plugins/element-ui"},
	//{src:"~/plugins/codemirror", ssr: false},
	//{src:"~/plugins/persistedstate", ssr: false},
	//{src:"~/plugins/app", ssr: false},
	//{src:"~/plugins/test", ssr: false},
	],

	/*
  	** Headers of the page
  	*/
  	head: {
		title: 'starter',
  	  	meta: [
			{ charset: 'utf-8' },
  	  	  	{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
  	  	  	{ hid: 'description', name: 'description', content: 'Nuxt.js project' }
  	  	],
  	  	link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  	  	]
  	},
  	/*
  	** Global CSS
  	*/
  	css: [
		'font-awesome/css/font-awesome.min.css',
		//'element-ui/lib/theme-chalk/index.css',
		'~assets/css/main.css'
	],
  	/*
  	** Customize the progress-bar color
  	*/
  	loading: { color: '#3B8070' },
  	/*
  	 ** Build configuration
  	 */
  	build: {
		//analyze: true,
		babel: {
			//presets:[["es2015", {"module":false}]],
			plugins:[
				"syntax-dynamic-import",
				[
					"component",
					{
						libraryName:"element-ui",
						styleLibraryName:"theme-chalk",
					},
					'transform-async-to-generator',
					'transform-runtime',
				],
			]
		},
  	}
}
