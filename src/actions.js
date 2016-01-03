import {
    localStorageKey,
    PATCH, LOAD, SAVE, TICK, PLAY, STEP, PARK, DRAW, SEEK, SET_COLOR, RESET,
    NEXT_ROUND, DONE,
} from "constants"

export const patch = (payload) => ({ type: PATCH, payload })

export const load = (text) => (dispatch) => {
    if (!text) {
        dispatch({type: RESET})
    }
    try {
        var state = JSON.parse(text)
        dispatch({type: LOAD, payload: state})
    } catch (e) {
        console.error("invalid save state.")
    }
}

const tick = () => (dispatch, getState) => {
    const { mode, frameRate } = getState()
    if (mode === PLAY) {
        dispatch({ type: TICK })
        window.setTimeout(() => dispatch(tick()), 1000 / frameRate)
    }
}

export const save = () => (dispatch, getState) => {
    var stateJSON = JSON.stringify(getState().pixels)
    window.localStorage.setItem(localStorageKey, stateJSON)
    dispatch({ type: SAVE })
}

export const play = () => (dispatch, getState) => {
    if (getState().mode === PLAY) { return }
    dispatch({type: PLAY})
    dispatch(tick())
}

export const reset = () => {
    window.localStorage.removeItem(localStorageKey)
    return {type: RESET}
}

let lastDraw = null
export const draw = (payload) => (dispatch) => {
    if (lastDraw && eq(lastDraw, payload)) { return }
    lastDraw = payload
    dispatch({ type: DRAW, payload })
}

export const step = () => ({ type: STEP })
export const park = () => ({ type: PARK })
export const seek = (payload) => ({ type: SEEK, payload })
export const setColor = (payload) => ({ type: SET_COLOR, payload })
export const nextRound = () => ({ type: NEXT_ROUND })
export const done = () => ({ type: DONE })

function eq (a, b) {
    if (a === b) { return true }
    for (const key in a) {
        if (a[key] !== b[key]) { return false }
    }
    return true
}
