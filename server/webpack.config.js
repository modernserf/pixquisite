"use strict"
var webpack = require("webpack")
var autoprefixer = require("autoprefixer")
var HtmlPlugin = require("html-webpack-plugin")

var envStr = JSON.stringify(process.env.NODE_ENV || "development")
var isDev = envStr === `"development"`

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
var envPlugin = new webpack.DefinePlugin({
    "process.env": {
        NODE_ENV: envStr,
    },
})

var htmlPlugin = new HtmlPlugin({
    title: "Pixquisite Corpse",
    template: "src/index.html",
    inject: "head",
    env: envStr,
    hash: true,
})

var cssConfig = "css?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"

var entry = isDev
     ? ["webpack/hot/dev-server", "babel-polyfill", "whatwg-fetch", "./src/main.js"]
     : ["babel-polyfill", "whatwg-fetch", "./src/main.js"]

var plugins = isDev
    ? [
        envPlugin,
        htmlPlugin,
        new webpack.HotModuleReplacementPlugin(),
    ] : [
        envPlugin,
        htmlPlugin,
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: { warnings: false },
        }),
    ]

module.exports = {
    entry: entry,
    output: {
        filename: "main.js",
        path: process.cwd() + "/dist",
        publicPath: "/",
    },
    module: {
        loaders: [
            {test: /\.css$/, loaders: ["style", cssConfig, "postcss"]},
            {test: /\.js$/, exclude: /node_modules/, loader: "babel"},
            {test: /\.jsx$/, loader: "babel"},
            {test: /\.json$/, loader: "json"},
        ],
    },
    postcss: {
        defaults: [autoprefixer],
    },
    plugins: plugins,
    resolve: {
        extensions: ["", ".js", ".json", ".jsx"],
        modulesDirectories: ["node_modules", "src"],
    },
}
