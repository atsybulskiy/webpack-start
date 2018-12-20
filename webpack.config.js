const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index',
    },
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    watch: false,
    devtool: 'source-map',

    optimization: {
        //minimize: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'common',
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0 // This is example is too small to create commons chunks
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Learn JavaScript',
            hash: true,
            template: './index.html'
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('0.0.2'),
            PRODUCTION: false,
            HTML5_SUPPORT: true
        }),
        new webpack.HotModuleReplacementPlugin({
            // Options...
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: "jquery"
        })
    ],

    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },

    devServer: {
        port: 9000,
        hot: true,
        noInfo: true
    }
};
