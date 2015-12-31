/*eslint-disable one-var, no-var, strict*/
"use strict"

var path = require("path"),
    webpack = require("webpack"),
    config = require("./webpack.config"),
    DevServer = require("webpack-dev-server")

var dist = path.join(process.cwd(), "/dist")

var devServer = new DevServer(webpack(config), {
    contentBase: dist,
    hot: true,
    historyApiFallback: true,
})

devServer.listen(8088)
