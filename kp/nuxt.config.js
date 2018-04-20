module.exports = {
	srcDir: "client/",
	env:{
		//NODE_ENV:"development",
		HOST: "0.0.0.0",
		PORT: 8088,
	},

	router: {
	},

	plugins: [
	{src:"~/plugins/element-ui", ssr: false},
	{src:"~/plugins/codemirror", ssr: false},
	{src:"~/plugins/persistedstate", ssr: false},
	{src:"~/plugins/app", ssr: false},
	{src:"~/plugins/test", ssr: false},
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

	//babel: {
		//plugins: [
			//[
				//'component',
				//[
				//{
				//'libraryName': 'element-ui',
				//'styleLibraryName': 'theme-default'
				//},
				//'transform-async-to-generator',
				//'transform-runtime'
				//]
			//]
		//],
		//comments: false
	//},
	/*
  	** Global CSS
  	*/
  	css: [
		'~assets/css/main.css',
		'font-awesome/css/font-awesome.min.css',
	],
  	/*
  	** Customize the progress-bar color
  	*/
  	loading: { color: '#3B8070' },
  	/*
  	 ** Build configuration
  	 */
  	build: {
		//vendor: [
			//"vue-template-compiler",
			//"vuex-persistedstate",
			//"axios",
			//"lodash",
			//"element-ui",
			//"elasticsearch",
			//"jshashes",
			//"js-base64",
			//"js-cookie",
			//"jss",
			//"jss-preset-default",
			//"node-gitlab-api",
			//"codemirror",
			//"vue-codemirror",
		//],
		/*
  	  	 ** Run ESLINT on save
  	  	 */
  	  	extend (config, ctx) {
  	  	  //if (ctx.isClient) {
  	  		//config.module.rules.push({
  	  		  //enforce: 'pre',
  	  		  //test: /\.(js|vue)$/,
  	  		  //loader: 'eslint-loader',
  	  		  //exclude: /(node_modules)/
  	  		//})
  	  	  //}
		    console.log(config.resolve);
			config.resolve.alias = {
				...(config.resolve.alias || {}),
				'vue$':'vue/dist/vue.esm.js',
			},
			config.node = {
				...(config.node || {}),
				fs: "empty",
				tls: "empty",
  	  			net: "empty",
  	  		};
  	  	}
  	}
}
