
let path = require('path');
const options = require('./pathes');
const webpack = require('webpack');
// const WebpackNotifierPlugin = require('webpack-notifier');
const WebpackAutoInject = require('webpack-auto-inject-version');
const StringReplacePlugin = require("string-replace-webpack-plugin");

var HappyPack = require('happypack');
// const loaders = require('./webpack/loaders');
// const plugins = require('./webpack/plugins');
// const postcssInit = require('./webpack/postcss');

// const applicationEntries = process.env.NODE_ENV === 'development'
//   ? [ 'webpack-hot-middleware/client?reload=true' ]
//   : [ ];


const sourceMap = process.env.TEST || process.env.NODE_ENV !== 'production'
  ? [new webpack.SourceMapDevToolPlugin({ filename: null, test: /\.jsx?$/ })]
  : [];

// 0||console.log(options.path.destServer);
// 0||console.log(  __dirname + options.path.destServer + '/Scripts');



module.exports = {
    // entry: ['./frontend/js/react/indexmp.tsx'],
    entry: ['./frontend/js/react/indexmp.jsx'],
    // entry: [ './frontend/js/react/indexmp.tsx' ].concat(applicationEntries),

    output: {
        path: __dirname + options.path.destServer + '/Scripts/dist',
        // path: 'D:/Project/altbetNew/RefactoredCore/Alt.Bet/Scripts',
        // publicPath: "Scripts/",
        filename: "bundler.js"
    },

    // output: {
    //     path: __dirname + pathes.destServer + '/Scripts',
    //     // path: path.join(__dirname, pathes.destServer, 'Scripts'),
    //     filename: '[name].[hash].js',
    //     publicPath: '/',
    //     sourceMapFilename: '[name].[hash].js.map',
    //     chunkFilename: '[id].chunk.js',
    // },

    devtool: process.env.NODE_ENV === 'production' ?
        'source-map' :
        // 'eval',
        'inline-source-map',

    resolve: {
        extensions: [
            '',
            '.jsx',
            '.js',
            '.ts',
        ],
    },

    plugins: [
        // new WebpackNotifierPlugin({title: 'bundleR.js', alwaysNotify: true}),

        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
            __TEST__: JSON.stringify(process.env.TEST || false),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),

        new HappyPack({
            id: 'jsx',
            threads: 4,
            loaders: ['babel-loader'],
        }),
        new HappyPack({
            id: 'js',
            threads: 4,
            loaders: ['babel-loader']
        }),

        new StringReplacePlugin(),
        new WebpackAutoInject({
            components: {
                AutoIncreaseVersion: true
            }
        }),

    ],
    // ].concat(sourceMap),

    module: {
        // preLoaders: [
        //   loaders.tslint,
        // ],
/*        rules: [ // webpack 2 !!!!!
            {
                test: /\.json$/,
                use: 'json-loader'
            }
        ],*/
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.jsx$/,
                loaders: [ 'happypack/loader?id=jsx' ]
                // loader: "babel-loader",
                // exclude: [/node_modules/, /public/, /vendor/],
                // query: {
                //     presets: ['es2015', 'stage-0', 'react'],
                //     plugins: [['transform-class-properties', { "spec": true }], ["remove-comments"]],
                // }
            },
            {
                test: /\.js$/,
                loaders: [ 'happypack/loader?id=js' ],
                // loader: "babel-loader",
                // loader: "babel-loader?cacheDirectory=true",
                // exclude: [/node_modules/, /public/, /vendor/],
                // query: {
                //     presets: ['es2015', 'stage-0', 'react'],
                //     plugins: [['transform-class-properties', { "spec": true }], ["remove-comments"]],
                // }
            },
            {
                test: /\.ts?$/,
                // loader: 'awesome-typescript-loader',
                loader: 'ts-loader',
                exclude: [/node_modules/, /public/, /vendor/],
            },
            // {
            //     test: /\.js$/,
            //     loader: 'string-replace',
            //     query: {
            //         multiple: [
            //             {search: '[[REPLACE VERSION]]', replace: getBuildTime()},
            //             // {search: '_', replace: 'window.lodash'},
            //         ],
            //         flags: 'i',
            //     }
            // },
            // configure replacements for file patterns
            {
                test: /\.js$/,
                loader: StringReplacePlugin.replace({
                    replacements: [
                        {
                            pattern: /<<REPLACE VERSION>>/ig,
                            replacement: function (match, p1, offset, string) {
                                return getBuildTime();
                            }
                        }
                    ]
                })
            }
        ],
    },

    externals: {
        // 'react/lib/ReactContext': 'window',
        // 'react/lib/ExecutionEnvironment': true,
        // 'react/addons': true,
    },

    watch: true,

    watchOptions: {
        aggregateTimeout: 300
    },
    // postcss: postcssInit,
};



function getBuildTime()
{
    let $now = new Date();
    return `${$now.getDate()} ${$now.getHours()}:${$now.getMinutes()}:${$now.getSeconds()}`;
}