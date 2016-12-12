'use strict';

var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = [{
    // context: __dirname + '/_source',
    entry: {
        // main: ['webpack-dev-server/client', "webpack/hot/dev-server", "./_source/js/main"],
        lesson02: "./_source/js/lesson02/lesson02.js",
        test: "./_source/js/lesson02/test.js",
        lesson03routing: "./_source/js/lesson03routing/lesson03routing.js",
        lesson05todolist: "./_source/js/lesson05todolist/main.js",
        // lesson06: "./_source/js/lesson06/main.js",
    },
    output: {
        path: __dirname + '/build/js/',
        publicPath: 'build/',
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: [/node_modules/, /public/],
                query: {
                    presets:['es2015', 'react']
                  }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!autoprefixer-loader",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!autoprefixer-loader!less",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.gif$/,
                loader: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.jpg$/,
                loader: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=10000&mimetype=image/png"
            },
            {
                test: /\.svg/,
                loader: "url-loader?limit=26000&mimetype=image/svg+xml"
            },
            {
                test: /\.jsx$/,
                // loader: "react-hot!babel",
                loader: "babel-loader",
                exclude: [/node_modules/, /public/],
                query: {
                    presets:['es2015', 'react']
                  }
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    },

    // watch: true,
    //
    watchOptions: {
        aggregateTimeout: 300
    },

    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
    ],
    //
    // devServer: {
    //     host: 'localhost',
    //     port: 8080,
    //     inline: true,
    //     contentBase: __dirname + '/build',
    //     hot: true
    // }
},

// BM: redux lesson
{
    devtool: 'cheap-module-eval-source-map',
    // context: __dirname + '/_source',
    entry: {
        lessonredux: [ './_source/js/lessonredux/src/index.js' ]
    },
    output: {
        path: __dirname + '/build/js/',
        publicPath: 'build/',
        filename: "[name].js"
    },
    module: {
        // preLoaders: [
        //     {
        //         test: /\.js$/,
        //         loaders: ['eslint'],
        //         include: [
        //             path.resolve(__dirname, "_source/js/lessonredux/src"),
        //         ],
        //     }
        // ],
        loaders: [
            {
                test: /\.js$/,
                // loaders: ['react-hot', 'babel-loader'],
                loader: 'babel-loader',
                query: {
                  plugins: ['transform-runtime'],
                  presets: ['es2015', 'stage-0', 'react'],
                },
                        include: [
                            path.resolve(__dirname, "_source/js/lessonredux/src"),
                        ],
                // plugins: ['transform-runtime'],
            }
        ]
    },

    // watch: true,
    //
    watchOptions: {
        aggregateTimeout: 300
    },

    plugins: [
        new WebpackNotifierPlugin({title: 'Lesson Redux', alwaysNotify: true}),
        new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
        devFlagPlugin
    ],
}];

/*
"babel-cli": "^6.18.0",
npm run devServer
node D:/Project/yii2/node_modules/webpack/bin/webpack.js
       "devserver": "webpack-dev-server --debug --hot --devtool eval-source-map --output-pathinfo --watch --colors --inline --content-base build --port 8080 --host localhost"
*/