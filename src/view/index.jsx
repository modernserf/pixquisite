import "./style.css"

import React from "react"
import { connect } from "react-redux"

import { Grid } from "./Grid"
import { PLAY, STEP, PARK } from "constants"
import {
    load, save, reset, play, step, park, seek, setColor, nextRound, done,
} from "actions"

export const Main = connect(({complete}) => ({complete}))(
function Main ({complete}) {
    const controls = complete ? <EndControls/> : <Controls/>
    return (
        <div className="wrap">
            <Grid/>
            {controls}
        </div>
    )
})

const EndControls = connect(({mode}) => ({ mode }), { play, park })(
function EndControls ({mode, play, park}) {
    const button = mode === PLAY
        ? <button onClick={park}>Pause</button>
        : <button onClick={play}>Play</button>
    return (
        <div>{button}</div>
    )
})

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

const Rounds = connect(({round}) => ({ round }), { nextRound, done })(
function Rounds ({ round, nextRound, done }) {
    return (
        <div>
            <button onClick={nextRound}>Next</button>
            <button onClick={done}>Done</button>
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
                padding: "24px 24px",
                border: c === color ? "4px solid black" : "none",
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

function Controls () {
    return (
        <div className="control-group">
            <Transport/>
            <Scrubber/>
            <Palette/>
            <Rounds/>
            <FileBrowser/>
        </div>
    )
}
