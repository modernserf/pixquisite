import makeSchema, { types as t } from "schema-builder"
import enum from "./util/enum"

export const localStorageKey = "pixquisite-v5"

export const schema = makeSchema([
    ["tick", "game clock signal"],
    ["play", "set play mode to playing"],
    ["step", "set play mode to stepping"],
    ["draw_request", "x and y coordinates for drawing pixel",
        ["x", t.Number],
        ["y", t.Number]],
    ["draw", "write a pixel to the animation with the current pixel settings",
        ["x", t.Number],
        ["y", t.Number],
        ["step", t.Number],
        ["ttl", t.Number],
        ["color", t.String]],
    ["seek", "move the play head to position", t.Number],
    ["setColor", "set draw color", t.String],
    ["setSpeed", "set draw ttl", t.Number],
    ["done_request"],
    ["done", "save animation, go to sharing URL"],
    ["reset", "clear animation, go to play screen"],
    ["load_request", "get animation stored at id", t.String],
    ["load", "load animation", t.Object],
])

export const playModes = enum(["play", "step"])

export const selectors = enum(["play", "draw", "route"])

export const env = {
    width: 16,
    height: 16,
    maxDecay: 4,
    maxSteps: 32,
    resolution: 24, // css px per cell
    frameRate: 12,
}

const c = {
    black: [20, 20, 20],
    white: [255, 255, 255],
    red: [255, 0, 0],
    yellow: [255, 255, 0],
    blue: [0, 0, 255],
    green: [0, 127, 0],
    orange: [255, 127, 0],
    pink: [255, 127, 127],
    purple: [127, 0, 127],
    cyan: [127, 127, 255],
    lime: [0, 255, 0],
    lavender: [255, 127, 255],
}

// map color name to cycle
// most colors are single-item cycle
export const colorMap = enum([
    "black", "white", "red", "blue", "green", "orange", "purple",
], (key) => [c[key]])

colorMap.rainbow = [
    c.pink, c.orange, c.yellow, c.lime, c.cyan, c.lavender,
]
