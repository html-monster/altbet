'use strict';

var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');

const DEST_SERVER = '/../altbetNew/RefactoredCore/Alt.Bet';
// const DEST_SERVER = '/../../altbetNew/Alt.Bet';


var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
    devtool: 'cheap-inline-module-source-map',

    entry: "./frontend/js/react/pageMyPos.js",
    output: {
        path: __dirname + DEST_SERVER + '/Scripts',
        publicPath: "Scripts/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: [/node_modules/, /public/],
                // query: {
                //   plugins: ['transform-runtime'],
                //   presets: ['es2015', 'stage-0', 'react'],
                // },
            },
            {
                test: /\.jsx$/,
                loader: "react-hot!babel",
                exclude: [/node_modules/, /public/]
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
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
        devFlagPlugin
    ],
};