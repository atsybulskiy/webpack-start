const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index.js',
        profile: './profile.js'
    },
    output: {
        //filename: 'bundle.js',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    resolve: {
        extensions: ['.js']
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
        // new webpack.ProvidePlugin({
        //     $: 'jquery'
        // })

    ]
};
