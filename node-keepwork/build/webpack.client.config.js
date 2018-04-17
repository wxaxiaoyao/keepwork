const path = require("path");
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = merge(baseConfig, {
	entry: './entry/entry-client.js',
	output: {
		path: path.resolve(__dirname, '../server/views/'),
		publicPath: path.resolve(__dirname, '../server/views/'),
		//filename:"build.js",
		//libraryTarget: 'commonjs2'
	},
	plugins: [
    	// 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    	// 以便可以在之后正确注入异步 chunk。
    	// 这也为你的 应用程序/vendor 代码提供了更好的缓存。
        //new webpack.optimize.CommonsChunkPlugin({
             //name: "manifest",
              //minChunks: Infinity
        //}),
    	// 此插件在输出目录中
    	// 生成 `vue-ssr-client-manifest.json`。
    	new VueSSRClientPlugin()
  	],
	
	optimization: {
		//splitChunks: {
			//chunks: "initial", // 必须三选一： "initial" | "all"(默认就是all) | "async" 
			//minSize: 0, // 最小尺寸，默认0
			//minChunks: 1, // 最小 chunk ，默认1
			//maxAsyncRequests: 1, // 最大异步请求数， 默认1
			//maxInitialRequests : 1, // 最大初始化请求书，默认1
			//name: function(){}, // 名称，此选项可接收 function
			//cacheGroups:{ // 这里开始设置缓存的 chunks
				//priority: 0, // 缓存组优先级
				//vendor: { // key 为entry中定义的 入口名称
					//chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是异步) 
					//test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
					//name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
					//minSize: 0,
					//minChunks: 1,
					//enforce: true,
					//maxAsyncRequests: 1, // 最大异步请求数， 默认1
					//maxInitialRequests : 1, // 最大初始化请求书，默认1
					//reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
				//}
			//}
		//}
	}
})
