const path = require('path');
const webpack = require('webpack')
const webpackMerge = require('webpack-merge');


const options = {
	loader:{
		scriptLoader: ['babel-loader'],
		styleLoader : [
        	{
        		loader:'style-loader'
        	},{
        		loader:'css-loader',
        		options:{
        			minimize:true
        		}
        	},{
				loader:'postcss-loader',
				options: {
            		config: {
              			path: path.resolve(__dirname, '../postcss.config.js')
            		}
          		}
      		}
		],
		imgLoader:[
			{
	        	loader: 'file-loader',
	        	options: {
		            name: 'images/[name].[hash:5].[ext]',
		        }
	      	}
		],
		iconFonts: [{
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: '[path][name].[ext]?[hash:8]'
            }
        }],
        videoLoader:[
            {
                loader: 'file-loader'
            }
        ]
	},
	beforePlugins: [
	    //模块热更新    --  开发环境
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
	]
};

module.exports = function (data) {			//从webpack.config.js 传过来的env参数
	options.env = data.env;

	return webpackMerge(require('./webpack.base')(options), {
		devtool: "source-map",
        devServer:{
        	port:9000,
	        historyApiFallback: true,
	        inline: true,
	        hot: true,
	        host: 'localhost',
	        hotOnly:true,
	        proxy:{
	            '/api/*':{
	                target: 'http://localhost:5000/',
	                changeOrigin: true,
	                secure: false
	            }
	        },
        }
    });

}