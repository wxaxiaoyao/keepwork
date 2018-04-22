const path = require("path");
const webpack = require("webpack");

const rootdir = path.resolve(".");

module.exports = {
	srcDir: "client/",

	env: {
		rootdir,
	},

	plugins: [
	{src:"~/plugins/app", ssr: false},
	{src:"~/plugins/persistedstate", ssr: false},
	{src:"~/plugins/codemirror", ssr: false},
	{src:"~/plugins/element-ui"},
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
		analyze: true,
		vendor: [
			"lodash",
			"axios",
			"vuex-persistedstate",
		],
		babel: {
			//presets:[
			//],
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
			],
		},
  	  	extend (config, ctx) {
			if (config.name == "server") {
				return;
			}

			config.entry["codemirror"] = ["~/plugins/codemirror"];
			config.entry["elementUI"] = ["~/plugins/element-ui"];
			config.plugins[0] = new webpack.optimize.CommonsChunkPlugin({
				//name:"vendor",
				names: ["elementUI", "codemirror", "vendor"],
				//chunks: ["lodash", "axios"],
				minChunks: Infinity,
			});

			config.resolve.alias["vue$"] = "vue/dist/vue.esm.js";
			//config.resolve.alias["gitlabapi$"] = "~/lib/gitlab-api/index.js";
			//console.log(config.resolve.alias);
			config.node = {
				...(config.node || {}),
				fs: "empty",
				tls: "empty",
  	  			net: "empty",
  	  		};
  	  	}
  	}
}
