import "./reset.css"
import S from "./style.css"

import React from "react"
import { connect } from "react-redux"

import { Grid } from "./Grid"
import { PLAY } from "constants"
import {
    load, save, reset, play, step, seek, setColor, nextRound, done, setSpeed,
} from "actions"

export const Main = connect(({complete}) => ({complete}))(
function Main ({complete}) {
    const controls = complete ? <PlayToggle/> : <Controls/>
    return (
        <div className={S.main}>
            <div className={S.grid_wrap}>
                <Grid />
                <Palette />
            </div>
            {controls}
            <FileBrowser />
        </div>
    )
})

const hasTouchEvents = "ontouchstart" in document.documentElement

const touchClick = (fn) => hasTouchEvents
    ? { onTouchEnd: fn }
    : { onMouseDown: fn }

const PlayToggle = connect(({mode}) => ({ mode }), { play, step })(
function PlayToggle ({mode, play, step}) {
    const button = mode === PLAY
        ? <button type="button" {...touchClick(step)}>Step</button>
        : <button type="button" {...touchClick(play)}>Play</button>
    return (
        <div>{button}</div>
    )
})

function Transport () {
    return (
        <div className={S.transport}>
            <PlayToggle />
            <Scrubber />
        </div>
    )
}

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
        <div className={S.scrubber}>
            <input type="range"
                min={0} max={maxSteps}
                value={step}
                onChange={(e) => seek(Number(e.target.value))}/>
        </div>
    )
})

const SpeedScrubber = connect(
({stepSpeed, maxStepSpeed}) => ({stepSpeed, maxStepSpeed}),
{ setSpeed })(
function SpeedScrubber ({stepSpeed, maxStepSpeed, setSpeed}) {
    return (
        <div className={S.scrubber}>
            <input type="range"
                min={0} max={maxStepSpeed}
                value={stepSpeed}
                onChange={(e) => {
                    e.preventDefault()
                    setSpeed(Number(e.target.value))
                }}/>
            <div className={S.scrubber_labels}>
                <span >slow</span>
                <span >fast</span>
            </div>
        </div>
    )
})

const colors = ["black", "white", "red", "blue", "green", "orange", "purple"]

const Palette = connect((s) => s, { setColor })(
function Palette ({color, setColor}) {
    const colorCells = colors.map((c) =>
        <button key={c}
            type="button"
            className={S.palette_button}
            style={{
                backgroundColor: c,
                border: c === color ? "4px solid black" : "none",
            }}
            {...touchClick(() => setColor(c))}/>)

    return (
        <div className={S.palette}>{colorCells}</div>
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
            <SpeedScrubber />
            <Rounds/>
        </div>
    )
}
