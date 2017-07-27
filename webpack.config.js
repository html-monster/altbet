'use strict';

// var path = require('path');
// var WebpackNotifierPlugin = require('webpack-notifier');
// var webpack = require('webpack');

let configBundle = require('./webpackinc/webpack.bundle');
let configBundleR = require('./webpackinc/webpack.config.redux');
let configBundleM = require('./webpackinc/webpack.config.models');
// let configAdmin = require('./webpackinc/webpack.config.admin');



// var devFlagPlugin = new webpack.DefinePlugin({
//   __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
// });

module.exports = [
    configBundle,
    configBundleR,
    configBundleM,
    // configAdmin,
    ];


// var devFlagPlugin = new webpack.DefinePlugin({
//   __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
// });

// {
//     devtool: 'cheap-inline-module-source-map',
//
//     entry: "./frontend/js/react/pageMyPosMount.js",
//     output: {
//         path: __dirname + pathes.destServer + '/Scripts',
//         publicPath: "Scripts/",
//         filename: "bundle.js"
//     },
//     module: {
//         loaders: [
//             {
//                 test: /\.js$/,
//                 loader: "babel",
//                 exclude: [/node_modules/, /public/],
//                 query: {
//                   // plugins: ['transform-runtime'],
//                   presets: ['es2015', 'stage-0', 'react'],
//                 },
//             },
//             {
//                 test: /\.jsx$/,
//                 loader: "babel",//react-hot!
//                 exclude: [/node_modules/, /public/],
//                 query: {
//                     presets: ['es2015', 'stage-0', 'react'],
//                 }
//             }
//         ]
//     },
//     watch: true,
//
//     watchOptions: {
//         aggregateTimeout: 100
//     },
//
//     plugins: [
//         new WebpackNotifierPlugin({title: 'bundle.js', alwaysNotify: true}),
//         new webpack.optimize.OccurenceOrderPlugin(),
//         // new webpack.HotModuleReplacementPlugin(),
//         // new webpack.NoErrorsPlugin(),
//         devFlagPlugin
//     ],
// };