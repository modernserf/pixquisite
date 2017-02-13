const buble = require("rollup-plugin-buble");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const uglify = require("rollup-plugin-uglify");
const replace = require("rollup-plugin-replace");

const plugins = [nodeResolve({
        jsnext: true,
        main: true,
        browser: true
    }), commonjs({
        include: "node_modules/**"
    }), replace({
        "process.env.NODE_ENV": JSON.stringify(
            process.env.NODE_ENV || "development"
        )
    }), buble()];

if (process.env.NODE_ENV === "production") {
    plugins.push(uglify());
}

module.exports = { plugins, format: "iife" };
