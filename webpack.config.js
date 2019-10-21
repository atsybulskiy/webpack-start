const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const preCss = require('precss');
// const autoprefixer = require('autoprefixer');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index',
        // profile: './profile',
        // main: './main'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    watch: true,
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
            hash: false,
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
        new CopyPlugin([
            { from: 'images', to: 'images' }
        ]),
        require('autoprefixer')
        // new webpack.ProvidePlugin({
        //     $: 'jquery'
        // })
    ],

    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"]
            },
            {
                test: /\.(png|jpg|svg)$/,
                loader: 'url-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ]
    },

    devServer: {
        port: 9000,
        hot: true,
        noInfo: true
    }
};
