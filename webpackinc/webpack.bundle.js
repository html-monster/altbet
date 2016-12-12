
// var path = require('path');
const options = require('./pathes');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    devtool: 'cheap-inline-module-source-map',

    entry: "./frontend/js/react/pageMyPosMount.js",
    output: {
        path: __dirname + options.path.destServer + '/Scripts',
        publicPath: "Scripts/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: [/node_modules/, /public/],
                query: {
                  // plugins: ['transform-runtime'],
                  presets: ['es2015', 'stage-0', 'react'],
                },
            },
            {
                test: /\.jsx$/,
                loader: "babel",//react-hot!
                exclude: [/node_modules/, /public/],
                query: {
                    presets: ['es2015', 'stage-0', 'react'],
                }
            }
        ]
    },
    watch: true,

    watchOptions: {
        aggregateTimeout: 100
    },

    plugins: [
        new WebpackNotifierPlugin({title: 'bundle.js', alwaysNotify: true}),
        new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
        // devFlagPlugin
    ],
};