
const path = require('path');
const webpackMerge = require('webpack-merge');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');	//压缩js
const optimizeCss = require('optimize-css-assets-webpack-plugin');	//压缩css
const MiniCssExtractPlugin = require("mini-css-extract-plugin")  //单独打包css文件
const CleanWebpackPlugin = require('clean-webpack-plugin');//清除打包的文件

const options = {
	loader:{
		scriptLoader: ['babel-loader'],
		styleLoader : [ 
			MiniCssExtractPlugin.loader,
			"css-loader",
			{
				loader:'postcss-loader',
				options: {
            		config: {
              			path: path.resolve(__dirname, '../postcss.config.js')
            		}
          		}
      		}
      	],
		imgLoader: [
	      	{
	        	loader: 'file-loader',
	        	options: {
	        		outputPath: 'images/',
		            name: 'images/[name].[hash:5].[ext]',
		            useRelativePath:true,
		            publicPath:'../'
		        }
	      	},
	      	{
	            loader: "img-loader",
	            options: {
	                pngquant: {// png图片适用
	                    quality: 80
	                }
	            }
	    	}
	    ],
	    iconFonts:[{
      		loader: 'url-loader',
      		query: {
      			limit: 10000,
      			name: '[path][name]-[hash:8].[ext]'
      		}
      	}],
        videoLoader:[
            {
                loader: 'file-loader',
                options: {
                    // outputPath: 'static/',
                    // name: 'static/[name].[hash:5].[ext]',
                    // useRelativePath:true,
                    publicPath:'../'
                }
            }
        ]
	},

	beforePlugins: [
	    new optimizeCss({
            assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true }, // 这里是个大坑，稍后会提到
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
        }),
        new MiniCssExtractPlugin({
        	filename:'css/[name].[chunkhash:8].css'
        }),
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../')
        }),
	]
};

module.exports = function (data) {			//从webpack.config.js 传过来的env参数
	options.env = data.env;

	return webpackMerge(require('./webpack.base')(options), {

		optimization: {
			//包清单
	        runtimeChunk: {
	            name: "manifest"
	        },
	        //拆分公共包
	        splitChunks: {
	            cacheGroups: {
	                //项目公共组件
	                common: {
	                	test: /src/,
	                    chunks: "initial",
	                    name: "common",
	                    minChunks: 2,
	                    maxInitialRequests: 5,
	                    minSize: 0
	                },
	                //第三方组件
	                vendor: {
	                    test: /node_modules/,
	                    chunks: "initial",
	                    name: "vendor",
	                    priority: 10,
	                    enforce: true
	                }
	            }
	        },
		    minimizer: [
			    new UglifyJsPlugin({
					cache: true,
			        parallel: true
			    })
		    ]
		}
    });

}