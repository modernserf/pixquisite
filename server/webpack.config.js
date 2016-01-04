"use strict"
var webpack = require("webpack")
var autoprefixer = require("autoprefixer")
var HtmlPlugin = require("html-webpack-plugin")

var envStr = JSON.stringify(process.env.NODE_ENV || "development")

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
var envPlugin = new webpack.DefinePlugin({
    "process.env": {
        NODE_ENV: envStr,
    },
})

var cssConfig = "css?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"

var entry = envStr === `"development"`
     ? ["webpack/hot/dev-server", "./src/main.js"]
     : "./src/main.js"

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
    plugins: [
        envPlugin,
        new webpack.HotModuleReplacementPlugin(),
        new HtmlPlugin({
            title: "Pixquisite Corpse",
            template: "src/index.html",
            inject: "body",
            env: envStr,
            hash: true,
        }),
    ],
    resolve: {
        extensions: ["", ".js", ".json", ".jsx"],
        modulesDirectories: ["node_modules", "src"],
    },
}
