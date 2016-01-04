import {
    PATCH, TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, RESET,
    NEXT_ROUND, DONE, SET_SPEED, LOAD,
} from "constants"
import { select, selectSaved } from "store"
import { pushPath } from "redux-simple-router"

const api = {
    load: (id) => window.fetch(`/game/${id}`).then((r) => r.json()),
    save: (data) => window.fetch(`/game`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: new window.Headers({"Content-Type": "application/json"}),
    }).then((r) => r.json()),
}

// TODO: 404 page (maybe an animation!)
export const load = (id) => async (dispatch) => {
    try {
        const payload = await api.load(id)
        dispatch({ type: LOAD, payload })
        dispatch(play())
    } catch (e) {
        console.error("No data for this page.")
    }
}

export const patch = (payload) => ({ type: PATCH, payload })

const tick = () => (dispatch, getState) => {
    const { mode, frameRate } = select(getState())
    if (mode === PLAY) {
        window.setTimeout(() => dispatch(tick()), 1000 / frameRate)
        dispatch({ type: TICK })
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

// TODO: handle error
// TODO: do something while waiting
export const done = () => async (dispatch, getState) => {
    const data = selectSaved(getState())
    const res = await api.save(data)
    dispatch(pushPath(`/watch/${res.id}`))
    dispatch({ type: DONE })
}

export const reset = () => (dispatch) => {
    dispatch(pushPath("/play"))
    dispatch({type: RESET})
}

export const step = () => ({ type: STEP })
export const seek = (payload) => ({ type: SEEK, payload })
export const setSpeed = (payload) => ({ type: SET_SPEED, payload })
export const setColor = (payload) => ({ type: SET_COLOR, payload })
export const nextRound = () => ({ type: NEXT_ROUND })

function eq (a, b) {
    if (a === b) { return true }
    for (const key in a) {
        if (a[key] !== b[key]) { return false }
    }
    return true
}
