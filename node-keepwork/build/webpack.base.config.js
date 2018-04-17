
module.exports = {
	mode: 'production',
	module: {
		noParse: /es6-promise\.js$/,
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
						exclude: /node_modules/
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
		{
		  test: /\.(png|jpe?g|gif)(\?.*)?$/,
		  use: [
		    {
		  	loader: 'url-loader',
		  	options: {
		  	  limit: 10000,
		  	  name: 'img/[name].[hash:8].[ext]'
		  	}
		    }
		  ]
		},
		{
		  test: /\.(svg)(\?.*)?$/,
		  use: [
		    {
		  	loader: 'file-loader',
		  	options: {
		  	  name: 'img/[name].[hash:8].[ext]'
		  	}
		    }
		  ]
		},
		{
		  test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
		  use: [
		    {
		  	loader: 'url-loader',
		  	options: {
		  	  limit: 10000,
		  	  name: 'media/[name].[hash:8].[ext]'
		  	}
		    }
		  ]
		},
		{
		  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
		  use: [
		    {
		  	loader: 'url-loader',
		  	options: {
		  	  limit: 10000,
		  	  name: 'fonts/[name].[hash:8].[ext]'
		  	}
		    }
		  ]
		},
        {
			test: /\.css$/,
			use: ['vue-style-loader', 'css-loader']
        },
        {
			test: /\.es6$/,
			loader: "babel-loader",
			exclude: /node_modules/
        },
		]
	},
}
