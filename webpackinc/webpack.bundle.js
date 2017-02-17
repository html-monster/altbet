const options = require('./pathes');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');

const devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
    // devtool: 'cheap-inline-module-source-map',
    devtool: process.env.NODE_ENV === 'production' ?
        'source-map' :
        'inline-source-map',

    entry: "./frontend/js/react/index.js",
    output: {
        path: __dirname + options.path.destServer + '/Scripts/dist',
        // publicPath: "Scripts/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                exclude: [/node_modules/, /public/],
                query: {
                    presets: ['es2015', 'stage-0', 'react'],
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: [/node_modules/, /public/],
                query: {
                    presets: ['es2015', 'stage-0', 'react'],
                }
            }
        ]
    },
    watch: true,

    watchOptions: {
        aggregateTimeout: 300
    },

    plugins: [
        new WebpackNotifierPlugin({title: 'bundle.js', alwaysNotify: true}),
        new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
        devFlagPlugin
    ],
};