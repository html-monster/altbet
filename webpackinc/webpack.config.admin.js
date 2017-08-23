const path = require('path');
const options = require('./pathes');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
var HappyPack = require('happypack');

const WebpackAutoInject = require('webpack-auto-inject-version');
const StringReplacePlugin = require("string-replace-webpack-plugin");

// const ManifestPlugin = require('webpack-manifest-plugin');
// const AssetsPlugin = require('assets-webpack-plugin');

// var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    entry: {
        "bundle-adm": './frontend/admin_ts/bundle-adm.jsx',
        // "index-admin": './frontend/ts_admin/index-admin.scss',
    },
        // styles: './frontend/styles/index-admin.scss'
    // entry: [ './frontend/js/react/indexmp.tsx' ].concat(applicationEntries),

    output: {
        path: __dirname + options.path.destServerAdmin + '/Assets-frontend/Assembly/Scripts/dist', //Content
        // path: 'D:/Project/altbetNew/RefactoredCore/Alt.Bet/Scripts',
        // publicPath: __dirname + options.path.destServerAdmin + '/Scripts/js-assets/',
        filename: "[name].js",
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
        alias: {
            'actions': path.resolve(__dirname, '../frontend/admin_ts/react/actions'),
            'common': path.resolve(__dirname, '../frontend/admin_ts/react/common'),
            'constants': path.resolve(__dirname, '../frontend/admin_ts/react/constants'),
            'components': path.resolve(__dirname, '../frontend/admin_ts/react/components'),
            'containers': path.resolve(__dirname, '../frontend/admin_ts/react/containers'),
            'reducers': path.resolve(__dirname, '../frontend/admin_ts/react/reducers'),
            'admin': path.resolve(__dirname, '../frontend/admin_ts'),
        },
        extensions: [
            '',
            '.ts',
            '.js',
            '.jsx',
            '.scss',
        ],
    },

    plugins: [
        new WebpackNotifierPlugin({title: 'bundle ADM.js', contentImage: path.join(__dirname, '../frontend/Images/ImagesSrc/favicon-adm.png')}),
        // new ExtractTextPlugin('[name].css', {
        //     allChunks: true
        // })
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
        loaders: [
            {
                test: /\.ts?$/,
                // loader: 'awesome-typescript-loader',
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loaders: [ 'happypack/loader?id=js' ],
                // loader: "babel-loader",
                // exclude: [/node_modules/, /public/],
                // query: {
                //     presets: ['es2015', 'stage-0', 'react'],
                //     plugins: [['transform-class-properties', { "spec": true }], ["remove-comments"]],
                //   }
            },
            {
                test: /\.jsx$/,
                loaders: [ 'happypack/loader?id=jsx' ],
                // loader: "babel-loader",
                // exclude: [/node_modules/, /public/],
                // query: {
                //     presets: ['es2015', 'stage-0', 'react'],
                //     plugins: [['transform-class-properties', { "spec": true }], ["remove-comments"]],
                //   }
            },
            {
                test: /\.ts$/,
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
        ]
    },

    externals: {
        // '../frontend/js/ts/index': 'ABpp1', не работает
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
