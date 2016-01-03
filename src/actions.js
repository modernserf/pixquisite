import {
    PATCH, TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, RESET,
    NEXT_ROUND, DONE, SET_SPEED,
} from "constants"
import { select } from "store"
import { pushPath } from "redux-simple-router"

export const patch = (payload) => ({ type: PATCH, payload })

const tick = () => (dispatch, getState) => {
    const { mode, frameRate } = select(getState())
    if (mode === PLAY) {
        dispatch({ type: TICK })
        window.setTimeout(() => dispatch(tick()), 1000 / frameRate)
    }
}

export const play = () => (dispatch, getState) => {
    if (select(getState()).mode === PLAY) { return }
    dispatch({type: PLAY})
    dispatch(tick())
}

let lastDraw = null
export const draw = (payload) => (dispatch) => {
    if (lastDraw && eq(lastDraw, payload)) { return }
    lastDraw = payload
    dispatch({ type: DRAW, payload })
}

export const done = () => (dispatch) => {
    // TODO
    pushPath("/games/12345")
    dispatch({ type: DONE })
}

export const step = () => ({ type: STEP })
export const seek = (payload) => ({ type: SEEK, payload })
export const setSpeed = (payload) => ({ type: SET_SPEED, payload })
export const setColor = (payload) => ({ type: SET_COLOR, payload })
export const nextRound = () => ({ type: NEXT_ROUND })
export const reset = () => ({type: RESET})

function eq (a, b) {
    if (a === b) { return true }
    for (const key in a) {
        if (a[key] !== b[key]) { return false }
    }
    return true
}
