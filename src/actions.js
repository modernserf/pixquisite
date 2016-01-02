import {
    frameRateMs, localStorageKey,
    LOAD, SAVE, TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, RESET,
} from "constants"

// action creators
export const load = (text) => (dispatch) => {
    if (!text) {
        dispatch({type: RESET})
    }
    try {
        var state = JSON.parse(text)
        dispatch({type: LOAD, payload: state})
    } catch (e) {
        window.alert("Invalid saved state.")
    }
}

const tick = () => (dispatch, getState) => {
    if (getState().mode === PLAY) {
        dispatch({ type: TICK })
        window.setTimeout(() => dispatch(tick()), frameRateMs)
    }
}

export const save = () => (dispatch, getState) => {
    var stateJSON = JSON.stringify(getState().pixels)
    window.localStorage.setItem(localStorageKey, stateJSON)
    dispatch({ type: SAVE })
}

export const play = () => (dispatch) => {
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
export const seek = (payload) => ({ type: SEEK, payload })
export const setColor = (payload) => ({ type: SET_COLOR, payload })

function eq (a, b) {
    if (a === b) { return true }
    for (const key in a) {
        if (a[key] !== b[key]) { return false }
    }
    return true
}
