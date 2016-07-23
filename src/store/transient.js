import { colorMap, selectors, playModes, env } from "../constants"
import { sleep } from "../util/sleep"
import { put } from "redux-saga/effects"

const { maxSteps, frameRate } = env

const initState = {
    step: 0,
    decay: 2,
    mode: playModes.step,
    color: Object.keys(colorMap)[0],
    colorStep: 0,
}
export function reducer (state = initState, action) {
    if (action.type === "reset") { return initState }

    return combineDependentReducers(state, action, {
        step, mode, colorStep,
        color: patchOn("setColor"),
        decay: patchOn("setSpeed"),
    })
}

export const selector = selectors.play

export function select (state) {
    return state[selectors.play]
}

export const sagas = [tick]

function colorStep (state, {type}) {
    return type === "tick" ? state + 1 : state
}

function step (state, {type, payload}, {mode}) {
    switch (type) {
    case "tick":
        return mode === playModes.play ? (state + 1) % maxSteps : state
    case "draw":
        return mode === playModes.step ? (state + 1) % maxSteps : state
    case "done":
    case "load":
        return 0
    case "seek":
        return payload
    }
    return state
}

function mode (state, {type}) {
    switch (type) {
    case "step":
    case "seek":
    case "done":
        return playModes.step
    case "play":
    case "load":
        return playModes.play
    }
    return state
}

const patchOn = (matchType) => (prevState, {type, payload}) =>
    type === matchType ? payload : prevState

function combineDependentReducers (state, action, subReducers) {
    for (const key in subReducers) {
        const nextStateForKey = subReducers[key](state[key], action, state)
        if (nextStateForKey !== state[key]) {
            state = { ...state, [key]: nextStateForKey }
        }
    }
    return state
}

function * tick (getState) {
    while (true) {
        yield put({ type: "tick" })
        yield sleep(1000 / frameRate)
    }
}
