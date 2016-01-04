var express = require("express")
var promisify = require("es6-promisify")
var shortid = require("shortid")
var bodyParser = require("body-parser")

var argv = require("minimist")(process.argv.slice(2))
var port = argv.port || 3000
var redisPort = argv.redis || 6379
var gameTTL = argv.ttl || (24 * 60 * 60)

var redis = require("redis")
var client = redis.createClient({port: redisPort})
var rget = promisify(client.get.bind(client))
var rset = promisify(client.set.bind(client))
var rexpire = promisify(client.expire.bind(client))

var app = express()
app.use(bodyParser.json())

client.on("error", (err) => {
    console.error("Connection Error:", err)
})

client.on("connect", () => {
    console.log("Connected to redis on port", redisPort)
})

var noDataErr = new Error("No data.")

// load a saved game
app.get("/game/:id", (req, res) => {
    var id = req.params.id
    rget(id).then((data) => {
        if (!data) { throw noDataErr }
        res.set("Content-Type", "application/json")
        res.send(data)
    }).catch((e) => {
        res.status(404).send(e)
    })
})

// save a game
app.post("/game", (req, res) => {
    if (!req.body) {
        req.status(400).end()
        return
    }

    var id = shortid.generate()
    rset(id, JSON.stringify(req.body)).then(() => {
        return rexpire(id, gameTTL)
    }).then(() => {
        res.json({id: id})
    }).catch((e) => {
        console.error("Save Error:", e)
        res.status(400).end()
    })
})

var server = app.listen(port, () => {
    var port = server.address().port
    console.log("Game process on port", port)
})
