
var path = require('path');
const options = require('./pathes');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

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
    entry: ['./frontend/js/react/models'],
    // entry: [ './frontend/js/react/indexmp.tsx' ].concat(applicationEntries),

    output: {
        path: __dirname + options.path.destServer + '/Scripts',
        // path: 'D:/Project/altbetNew/RefactoredCore/Alt.Bet/Scripts',
        publicPath: "Scripts/",
        filename: "bundlem.js"
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
        'inline-source-map',

    resolve: {
        extensions: [
            '',
            '.ts',
        ],
    },

    plugins: [
        new WebpackNotifierPlugin({title: 'bundle-M.js', alwaysNotify: true}),

        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
            __TEST__: JSON.stringify(process.env.TEST || false),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],
    // ].concat(sourceMap),

    module: {
        // preLoaders: [
        //   loaders.tslint,
        // ],
        loaders: [
            {
                test: /\.ts?$/,
                // loader: 'awesome-typescript-loader',
                loader: 'ts-loader',
                exclude: /node_modules/,
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