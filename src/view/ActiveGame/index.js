import React from "react"
import { connect } from "react-redux"
import { createSelector } from "reselect"
import { select as selectT } from "../../store/transient"
import { select as selectDraw } from "../../store/draw"
import { GridWithHandlers } from "../Grid"
import { Palette } from "../Palette"
import { schema, env, playModes } from "../../constants"
import { touchClick } from "../../util/touch-click"

const {
    play, step, seek, setSpeed, setColor,
    done_request: done,
    draw_request: draw,
} = schema.actionCreators

const row = {
    display: "flex",
    flexDirection: "row",
}

const gridWrap = row
const transport = row
const scrubber = {
    flexGrow: 1,
    maxWidth: 400,
    margin: "0 24px",
}

const scrubberLabels = {
    ...row,
    justifyContent: "space-between",
}

const { maxDecay, maxSteps } = env

const GridController = connect(createSelector(
(state) => selectT(state).colorStep,
selectDraw,
(colorStep, drawState) => ({...drawState, colorStep})),
{ draw })(GridWithHandlers)
const PaletteController = connect(selectT, { setColor })(Palette)

const PlayToggle = connect(selectT, { play, step })(
function PlayToggle ({mode, play, step}) {
    const button = mode === playModes.play
        ? <button type="button" {...touchClick(step)}>Step</button>
        : <button type="button" {...touchClick(play)}>Play</button>
    return (
        <div>{button}</div>
    )
})

const Scrubber = connect(selectT, { seek })(
function Scrubber ({step, seek}) {
    return (
        <div style={scrubber}>
            <input type="range"
                min={0} max={maxSteps - 1}
                value={step}
                onChange={(e) => seek(Number(e.target.value))}/>
        </div>
    )
})

function Transport () {
    return (
        <div style={transport}>
            <PlayToggle />
            <Scrubber />
        </div>
    )
}

const Rounds = connect(selectT, { done })(
function Rounds ({ round, done }) {
    return (
        <div>
            <button onClick={() => done()}>Done</button>
        </div>
    )
})

const SpeedScrubber = connect(selectT, { setSpeed })(
function SpeedScrubber ({decay, setSpeed}) {
    return (
        <div style={scrubber}>
            <input type="range"
                min={0} max={maxDecay}
                value={decay}
                onChange={(e) => {
                    e.preventDefault()
                    setSpeed(Number(e.target.value))
                }}/>
            <div style={scrubberLabels}>
                <span >fast</span>
                <span >slow</span>
            </div>
        </div>
    )
})

// TODO: should this reset on mount?
export function ActiveGame () {
    return (
        <div>
            <div style={gridWrap}>
                <GridController />
                <PaletteController />
            </div>
            <div>
                <Transport/>
                <SpeedScrubber />
                <Rounds/>
            </div>
        </div>
    )
}
