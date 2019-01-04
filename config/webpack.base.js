const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');





module.exports = function (options) {


	return {
		mode: options.env === 'production' ? 'production' : 'development',
		entry: {
            index: path.resolve(__dirname, '../src/index.js')
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: options.env === 'development' ?'js/[name].[hash:8].js':'js/[name].[chunkhash:8].js',
            // publicPath:  options.env === 'production' ?'./':'/',
            publicPath:'/'
        },
        module:{
        	rules:[
        		{
                    test: /\.(js|jsx)$/,
			    	// test: /\.js$/,
			      	exclude: /node_modules/,
			      	use: options.loader.scriptLoader
			    },
			    {
			        test: /\.css$/,
			        use: options.loader.styleLoader
			    },
			    {
			        test: /\.(jpe?g|png|gif|svg)$/i,
			        use: options.loader.imgLoader
			    },
			    {
                    test: /\.(eot|woff|woff2|ttf|otf)$/,
                    use: options.loader.iconFonts
			    },
				{
                    test: /\.(mp4)$/,
                    use: options.loader.videoLoader
                }
        	]
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        plugins: (options.beforePlugins || []).concat([
        	new HtmlWebpackPlugin({
                title:'马云逸的博客',
                template: path.resolve(__dirname, '../src/index.tmpl.html'),
                favicon: path.resolve(__dirname, '../public/favicon.ico'),
                filename: 'index.html',
            }),

        ])
	}
}