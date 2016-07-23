import { colorMap } from "../constants"
import base64 from "base64-js"

// encode/decode the animation in a base64 binary string

// color   step decay   x  y
// 12      32   4       16 16    -- values
// 8       5    3       4  4     -- bits

const colorKeys = Object.keys(colorMap)
const colorIndex = colorKeys.reduce((m, k, i) => {
    m[k] = i
    return m
}, {})

function encodeEvent ({ color, step, decay, x, y }) {
    const posByte = (x << 4) + y
    const stepByte = (step << 3) + decay
    const colorByte = colorIndex[color]
    return [colorByte, stepByte, posByte]
}

function decodeEvent (colorByte, stepByte, posByte) {
    const color = colorKeys[colorByte]
    const step = (0b11111000 & stepByte) >> 2
    const decay = 0b111 & stepByte
    const x = (0b11110000 & posByte) >> 4
    const y = 0b1111 & posByte
    return { color, step, decay, x, y }
}

export function encodeString (events) {
    const bytes = events.reduce((b, e) => {
        b.push.apply(b, encodeEvent(e))
        return b
    }, [])
    return base64.fromByteArray(bytes).replace("/", "_")
}

export function decodeString (str) {
    const buf = base64.toByteArray(str.replace("_", "/"))
    const res = []

    for (let i = 0; i < buf.length; i += 3) {
        res.push(decodeEvent(buf[i], buf[i + 1], buf[i + 2]))
    }

    return res
}
