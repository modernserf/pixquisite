import React from "react"
import { connect } from "react-redux"

import S from "./style.css"
import { select } from "store"
import { GridWithHandlers } from "view/Grid"
import { Palette } from "view/Palette"
import { PLAY } from "constants"
import { touchClick } from "util/touch-click"
import {
    play, step, seek, nextRound, done, setSpeed, setColor, draw,
} from "actions"

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

const GridController = connect(select, { draw })(GridWithHandlers)
const PaletteController = connect(select, { setColor })(Palette)

const PlayToggle = connect(select, { play, step })(
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

const Rounds = connect(select, { nextRound, done })(
function Rounds ({ round, nextRound, done }) {
    return (
        <div>
            <button onClick={nextRound}>Next</button>
            <button onClick={done}>Done</button>
        </div>
    )
})

const Scrubber = connect(select, { seek })(
function Scrubber ({maxSteps, step, seek}) {
    return (
        <div className={S.scrubber}>
            <input type="range"
                min={0} max={maxSteps - 1}
                value={step}
                onChange={(e) => seek(Number(e.target.value))}/>
        </div>
    )
})

const SpeedScrubber = connect(select, { setSpeed })(
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
