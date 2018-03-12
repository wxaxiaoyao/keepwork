var webpack=require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devServer: {
		port:3030,
	},
	configureWebpack: {
		entry:{
			test:"./src/components/mods/test.js",
		},
		output:{
			//libraryTarget: 'umd',
			//library:"[name]",
			//umdNamedDefine: true,
		},
		resolve:{ 
			alias:{ 
				'vue$':'vue/dist/vue.esm.js'  
			}, 
		},
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
