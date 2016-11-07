var webpack = require('webpack');

module.exports = {
    entry: "./frontend/js/react/index.js",
    output: {
        path: __dirname + '/../../altbetNew/Alt.Bet/Scripts',
        publicPath: "Scripts/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: [/node_modules/, /public/]
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

    devtool: 'cheap-inline-module-source-map'
};