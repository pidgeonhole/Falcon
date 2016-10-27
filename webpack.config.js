'use strict';

const path = require('path');
const webpack = require('webpack');
const webpack_dev_server = require('webpack-dev-server');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const base = "bundle";

module.exports = {
    devServer: {
        contentBase: './CodeQuiz/static',
        hot: true
    },
    entry: [
        'webpack-dev-server/client?http://localhost:8081', //client portion of dev server
        'webpack/hot/only-dev-server', // hot loading
        './src/index.js' // Entry path for bundling process
    ],
    output: {
        path: './CodeQuiz/static',
        filename: `${base}.[name].js`, // where my bundle is stored
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // for hot reloading
        new webpack.NoErrorsPlugin(), // prevent bundling if there's erroneous codes,
        new ExtractTextPlugin(`${base}.[name].css`),
        new webpack.ProvidePlugin({$: "jquery", jquery: "jquery"})
    ],
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {
                // css
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            // Fonts and Pictures
            {
                test: /\.woff(\d+)?$/,
                loader: 'url?prefix=font/&limit=5000&mimetype=application/font-woff'
            }, {
                test: /\.ttf$/,
                loader: 'file?prefix=font/'
            }, {
                test: /\.eot$/,
                loader: 'file?prefix=font/'
            }, {
                test: /\.svg$/,
                loader: 'file?prefix=font/'
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            // javascript
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    }
}
