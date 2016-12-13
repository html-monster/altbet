<<<<<<< Updated upstream
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
=======

// var path = require('path');
const options = require('./pathes');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    devtool: 'cheap-inline-module-source-map',

    entry: "./frontend/js/react/pageMyPosMount.js",
>>>>>>> Stashed changes
    output: {
        path: __dirname + options.path.destServer + '/Scripts',
        publicPath: "Scripts/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        devFlagPlugin
=======
        // devFlagPlugin
>>>>>>> Stashed changes
    ],
};