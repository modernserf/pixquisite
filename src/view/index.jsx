import "./style.css"

import React from "react"
import { connect } from "react-redux"

import { PLAY, STEP, PARK } from "constants"
import {
    load, save, reset, play, step, park, seek, setColor, draw, patch,
} from "actions"

export function Main () {
    return (
        <div className="wrap">
            <Grid/>
            <Controls/>
        </div>
    )
}

const Transport = connect(({mode}) => ({ mode }), { play, step, park })(
function Transport ({mode, play, step, park}) {
    const active = (m) => m === mode ? {
        border: "4px solid black",
    } : {}

    return (
        <div>
            <button style={active(PLAY)}
                onClick={play}>Play</button>
            <button style={active(STEP)}
                onClick={step}>Step</button>
            <button style={active(PARK)}
                onClick={park}>Park</button>
        </div>
    )
})

const Scrubber = connect(
({maxSteps, step}) => ({maxSteps, step}),
{ seek })(
function Scrubber ({maxSteps, step, seek}) {
    return (
        <div>
            <input type="range"
                min={0} max={maxSteps}
                value={step}
                onChange={(e) => seek(Number(e.target.value))}/>
        </div>
    )
})

const colors = ["black", "white", "red", "blue", "green", "orange", "purple"]

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

function EnvValue ({id, state}) {
    return (
        <div>
            <label>{id}</label>
            <input type="number"
                value={state[id]}
                onChange={(e) => state.patch({
                    [id]: Number(e.target.value),
                })}/>
        </div>
    )
}

const Environment = connect((s) => s, { patch })(
function Environment (state) {
    const vals = ["ttl", "width", "height", "maxSteps", "resolution", "frameRate"]
        .map((key) => <EnvValue key={key} id={key} state={state}/>)
    return (
        <div>
            {vals}
        </div>
    )
})

function Controls () {
    return (
        <div className="control-group">
            <Transport/>
            <Scrubber/>
            <Palette/>
            <FileBrowser/>
            <Environment/>
        </div>
    )
}

const mod = (a, b) => ((a % b) + b) % b

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
    drawCanvas ({pixels, step, width, height, resolution, maxSteps, ttl}) {
        const ctx = this._ctx
        ctx.clearRect(0, 0, width * resolution, height * resolution)
        for (var i = 0, ln = pixels.length; i < ln; i++) {
            const px = pixels[i]
            const p = mod(step - px.step, maxSteps)
            const showStep = p >= 0 && ttl > p

            if (showStep) {
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
        const { draw, resolution } = this.props
        draw({
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
