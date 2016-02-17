import React from "react"
import { connect } from "react-redux"
import { createSelector } from "reselect"
import S from "./style.css"
import { select as selectT } from "store/transient"
import { select as selectDraw } from "store/draw"
import { GridWithHandlers } from "view/Grid"
import { Palette } from "view/Palette"
import { env, PLAY } from "constants"
import { touchClick } from "util/touch-click"
import {
    play, step, seek, done, setSpeed, setColor, draw,
} from "actions"
const { maxDecay, maxSteps } = env

// TODO: should this reset on mount?
export function ActiveGame () {
    return (
        <div className={S.main}>
            <div className={S.grid_wrap}>
                <GridController />
                <PaletteController />
            </div>
            <div className={S.control_group}>
                <Transport/>
                <SpeedScrubber />
                <Rounds/>
            </div>
        </div>
    )
}

const GridController = connect(createSelector(
(state) => selectT(state).colorStep,
selectDraw,
(colorStep, drawState) => ({...drawState, colorStep})),
{ draw })(GridWithHandlers)
const PaletteController = connect(selectT, { setColor })(Palette)

const PlayToggle = connect(selectT, { play, step })(
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

const Rounds = connect(selectT, { done })(
function Rounds ({ round, done }) {
    return (
        <div>
            <button onClick={done}>Done</button>
        </div>
    )
})

const Scrubber = connect(selectT, { seek })(
function Scrubber ({step, seek}) {
    return (
        <div className={S.scrubber}>
            <input type="range"
                min={0} max={maxSteps - 1}
                value={step}
                onChange={(e) => seek(Number(e.target.value))}/>
        </div>
    )
})

const SpeedScrubber = connect(selectT, { setSpeed })(
function SpeedScrubber ({decay, setSpeed}) {
    return (
        <div className={S.scrubber}>
            <input type="range"
                min={0} max={maxDecay}
                value={decay}
                onChange={(e) => {
                    e.preventDefault()
                    setSpeed(Number(e.target.value))
                }}/>
            <div className={S.scrubber_labels}>
                <span >fast</span>
                <span >slow</span>
            </div>
        </div>
    )
})
