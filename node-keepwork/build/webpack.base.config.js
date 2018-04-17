
module.exports = {
	mode: 'production',
	module: {
		rules: [
		  {
			test: /\.vue$/,
			use: [
			  {
				loader: 'vue-loader',
				options: {
				  preserveWhitespace: false,
				  template: {
					doctype: 'html'
				  },
				  loaders: {
					css: [
					  {
						loader: 'vue-style-loader',
						options: {
						  shadowMode: false,
						  sourceMap: false
						}
					  },
					  {
						loader: 'css-loader',
						options: {
						  sourceMap: false,
						  minimize: false
						}
					  }
					],
					sass: [
					  {
						loader: 'vue-style-loader',
						options: {
						  shadowMode: false,
						  sourceMap: false
						}
					  },
					  {
						loader: 'css-loader',
						options: {
						  sourceMap: false,
						  minimize: false
						}
					  },
					  {
						loader: 'sass-loader',
						options: {
						  indentedSyntax: true,
						  sourceMap: false
						}
					  }
					],
					scss: [
					  {
						loader: 'vue-style-loader',
						options: {
						  shadowMode: false,
						  sourceMap: false
						}
					  },
					  {
						loader: 'css-loader',
						options: {
						  sourceMap: false,
						  minimize: false
						}
					  },
					  {
						loader: 'sass-loader',
						options: {
						  sourceMap: false
						}
					  }
					],
					less: [
					  {
						loader: 'vue-style-loader',
						options: {
						  shadowMode: false,
						  sourceMap: false
						}
					  },
					  {
						loader: 'css-loader',
						options: {
						  sourceMap: false,
						  minimize: false
						}
					  },
					  {
						loader: 'less-loader',
						options: {
						  sourceMap: false
						}
					  }
					],
					stylus: [
					  {
						loader: 'vue-style-loader',
						options: {
						  shadowMode: false,
						  sourceMap: false
						}
					  },
					  {
						loader: 'css-loader',
						options: {
						  sourceMap: false,
						  minimize: false
						}
					  },
					  {
						loader: 'stylus-loader',
						options: {
						  sourceMap: false
						}
					  }
					],
					styl: [
					  {
						loader: 'vue-style-loader',
						options: {
						  shadowMode: false,
						  sourceMap: false
						}
					  },
					  {
						loader: 'css-loader',
						options: {
						  sourceMap: false,
						  minimize: false
						}
					  },
					  {
						loader: 'stylus-loader',
						options: {
						  sourceMap: false
						}
					  }
					],
					js: [
					  {
						loader: 'cache-loader',
						options: {
						  cacheDirectory: '/mnt/d/workspace/lua/keepwork/vue/node_modules/.cache/cache-loader'
						}
					  },
					  {
						loader: 'babel-loader'
					  }
					]
				  },
				  cssSourceMap: false,
				  cssModules: {
					localIdentName: '[name]_[local]__[hash:base64:5]'
				  }
				}
			  }
			]
		  },
		  {
        	test: /\.js$/,
        	loader: 'babel-loader',
        	exclude: /node_modules/
      	  },
		]
	}
}
