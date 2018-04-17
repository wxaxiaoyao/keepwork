var webpack=require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	lintOnSave: false,
	devServer: {
		port:3030,
		disableHostCheck: true,
	},
	configureWebpack: {
		entry:"index.js",
		output:{
			//libraryTarget: 'umd',
			//library:"[name]",
			//umdNamedDefine: true,
			//publicPath: "static",
			//public: 'static',
		},
		resolve:{ 
			alias:{ 
				'vue$':'vue/dist/vue.esm.js'  
			}, 
		},
		plugins:[
			new CopyWebpackPlugin([{
				from: __dirname + '/static',
				to:"static",
				ignore: ['.*']
			}]),
		]
		//module: {
			//rules: [
			//{ 
				//test: /\.html$/, 
				//use: 'raw-loader',
			//},
			//]
		//}
		//externals: {
			//vue: {
				//root: 'Vue',
				//commonjs: 'vue',
				//commonjs2: 'vue',
				//amd: 'vue'
			//},
		//},
	},
}
