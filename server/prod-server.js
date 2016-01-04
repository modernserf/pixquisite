var express = require("express")
var proxy = require("express-http-proxy")
var argv = require("minimist")(process.argv.slice(2))

var webpack = require("webpack")
var config = require("./webpack.config")

var port = argv.port || 8088
var gamePort = argv.gamePort || 3000

var app = express()
var distPath = process.cwd() + "/dist"

app.use(express.static(distPath))
app.use("/game*", proxy("localhost:" + gamePort, {
    forwardPath: (req) => req.baseUrl,
}))
app.use("*", express.static(distPath))

webpack(config).run((err, stats) => {
    if (err) {
        console.error("Webpack error", err)
        // TODO: handle error?
        return
    }
    console.log("Webpack compiled")
})

var server = app.listen(port, () => {
    console.log("Static server listening on port", server.address().port)
})
