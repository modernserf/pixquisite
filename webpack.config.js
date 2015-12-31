"use strict"
var webpack = require("webpack")
var autoprefixer = require("autoprefixer")
var HtmlPlugin = require("html-webpack-plugin")

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
var envPlugin = new webpack.DefinePlugin({
    "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
    },
})

var cssConfig = "css?localIdentName=[path][name]---[local]---[hash:base64:5]"

module.exports = {
    entry: ["webpack/hot/dev-server", "./src/main.js"],
    output: {
        filename: "main.js",
        path: process.cwd() + "/dist",
        publicPath: "/",
    },
    module: {
        loaders: [
            {test: /\.css$/, loaders: ["style", cssConfig, "postcss"]},
            {test: /\.js$/, exclude: /node_modules/, loader: "babel"},
            // {test: /\.jsx$/, loaders: ["react-hot", "babel"]},
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
            env: JSON.stringify(process.env.NODE_ENV || "development"),
        }),
    ],
    resolve: {
        extensions: ["", ".js", ".json", ".jsx"],
        modulesDirectories: ["node_modules", "src"],
    },
}
