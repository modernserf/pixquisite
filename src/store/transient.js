import {
    colorMap, PLAY_SELECTOR, TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, RESET,
    SET_SPEED, DONE, LOAD,
} from "constants"
import { sleep } from "util/sleep"
import { put } from "redux-saga/effects"
import { env } from "constants"

const { maxSteps, frameRate } = env

const initState = {
    step: 0,
    decay: 2,
    mode: STEP,
    color: Object.keys(colorMap)[0],
    colorStep: 0,
}
export function reducer (state = initState, action) {
    if (action.type === RESET) { return initState }

    return combineDependentReducers(state, action, {
        step, mode, colorStep,
        color: patchOn(SET_COLOR),
        decay: patchOn(SET_SPEED),
    })
}

export const selector = PLAY_SELECTOR

export function select (state) {
    return state[PLAY_SELECTOR]
}

export const sagas = [tick]

function colorStep (state, {type}) {
    return type === TICK ? state + 1 : state
}

function step (state, {type, payload}, {mode}) {
    switch (type) {
    case TICK:
        return mode === PLAY ? (state + 1) % maxSteps : state
    case DRAW:
        return mode === STEP ? (state + 1) % maxSteps : state
    case DONE:
    case LOAD:
        return 0
    case SEEK:
        return payload
    }
    return state
}

function mode (state, {type}) {
    switch (type) {
    case PLAY:
    case STEP:
        return type
    case SEEK:
    case DONE:
        return STEP
    case LOAD:
        return PLAY
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
        yield put({ type: TICK })
        yield sleep(1000 / frameRate)
    }
}
