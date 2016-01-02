import "./style.css"

import React from "react"
import { connect } from "react-redux"

import {
    ttl, width, height, resolution, maxSteps,
} from "constants"
import {
    load, save, reset, play, step, seek, setColor, draw,
} from "actions"

export const Main = connect((state) => state)(
function Main ({step, storage = "", pixels}) {
    return (
        <div className="wrap">
            <Grid width={width} height={height}
                resolution={resolution}
                step={step}
                pixels={pixels}/>
            <Controls step={step} storage={storage}/>
        </div>
    )
})

const Transport = connect((s) => s, { play, step })(
function Transport ({mode, play, step}) {
    return (
        <div>
            <button onClick={play}>Play</button>
            <button onClick={step}>Step</button>
        </div>
    )
})

const Scrubber = connect((state) => state, { seek })(
function Scrubber ({step, seek}) {
    return (
        <div>
            <input type="range"
                min={0} max={maxSteps}
                value={step}
                onChange={(e) => seek(Number(e.target.value))}/>
        </div>
    )
})

const colors = ["black", "white", "red", "blue", "green", "yellow"]

const Palette = connect((s) => s, { setColor })(
function Palette ({color, setColor}) {
    const colorCells = colors.map((c) =>
        <td key={c}
            style={{
                backgroundColor: c,
                padding: "0 5px",
                border: c === color ? "1px solid black" : "none",
            }}
            onClick={() => setColor(c)}>
            &nbsp;</td>)

    return (
        <table><tbody><tr>{colorCells}</tr></tbody></table>
    )
})

const FileBrowser = connect((s) => s, { load, save, reset })(
function FileBrowser ({load, save, reset, saveState = ""}) {
    return (
        <div>
            <h3>LOL load/save</h3>
            <textarea value={saveState}
                onChange={(e) => load(e.target.value)}/>
            <button onClick={save}>Save</button>
            <button onClick={reset}>Reset</button>
        </div>
    )
})

function Controls ({step, storage}) {
    return (
        <div className="control-group">
            <Transport/>
            <Scrubber/>
            <Palette/>
            <FileBrowser/>
        </div>
    )
}

const mod = (a, b) => ((a % b) + b) % b

function showStep (it, now) {
    const p = mod(now - it, maxSteps)
    return p >= 0 && ttl > p
}

const Grid = connect((state) => state, { draw })(
class Grid extends React.Component {
    constructor () {
        super()
        this.state = { mousedown: false }
    }
    setContext (el) {
        if (!el) { return }
        this._ctx = el.getContext("2d")
    }
    componentWillUpdate (nextProps) {
        this.drawCanvas(nextProps)
    }
    drawCanvas ({pixels, step}) {
        const ctx = this._ctx
        ctx.clearRect(0, 0, width * resolution, height * resolution)
        for (var key in pixels) {
            let px = pixels[key]
            if (showStep(px.step, step)) {
                ctx.fillStyle = px.color
                // draw with 1px padding
                ctx.fillRect(
                    1 + px.x * resolution,
                    1 + px.y * resolution,
                    resolution - 2,
                    resolution - 2)
            }
        }
    }
    onMouseDown (e) {
        this.onDraw(e)
        this.setState({mousedown: true})
    }
    onMouseEnd () {
        this.setState({mousedown: false})
    }
    onMouseMove (e) {
        if (!this.state.mousedown) { return }
        this.onDraw(e)
    }
    onDraw (e) {
        this.props.draw({
            x: Math.floor(e.nativeEvent.offsetX / resolution),
            y: Math.floor(e.nativeEvent.offsetY / resolution),
        })
    }
    render () {
        const { width, height, resolution } = this.props
        return (
            <div>
                <canvas ref={(el) => this.setContext(el)}
                    onMouseDown={(e) => this.onMouseDown(e)}
                    onMouseUp={(e) => this.onMouseEnd(e)}
                    onMouseOut={(e) => this.onMouseEnd(e)}
                    onMouseMove={(e) => this.onMouseMove(e)}
                    width={width * resolution}
                    height={height * resolution}/>
            </div>
        )
    }
})
