import {
    colorMap,
    PLAY_SELECTOR, ENV_SELECTOR,
    TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, RESET, SET_SPEED,
    NEXT_ROUND, DONE, LOAD,
} from "constants"
import { sleep } from "util/sleep"
import { put } from "redux-saga"

const initState = {
    step: 0,
    round: 0,
    decay: 2,
    mode: STEP,
    color: Object.keys(colorMap)[0],
}

function step (state, {type, payload}, {mode}) {
    switch (type) {
    case TICK:
        return mode === PLAY ? (state + 1) : state
    case DRAW:
        return mode === STEP ? (state + 1) : state
    case NEXT_ROUND:
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
    case NEXT_ROUND:
    case DONE:
        return STEP
    case LOAD:
        return PLAY
    }
    return state
}

function round (state, {type}) {
    switch (type) {
    case NEXT_ROUND:
        return state + 1
    case DONE:
    case LOAD:
        return 0
    }
    return state
}

export function reducer (state = initState, action) {
    if (action.type === RESET) { return initState }

    return combineDependentReducers(state, action, {
        step, mode, round,
        color: patchOn(SET_COLOR),
        decay: patchOn(SET_SPEED),
    })
}

const patchOn = (matchType) => (prevState, {type, payload}) =>
    type === matchType ? payload : prevState

function combineDependentReducers (state, action, subReducers) {
    for (const key in subReducers) {
        const nextStateForKey = subReducers(state[key], action, state)
        if (nextStateForKey !== state[key]) {
            state = { ...state, key: nextStateForKey }
        }
    }
    return state
}

export const selector = PLAY_SELECTOR

function * tick (getState) {
    while (true) {
        yield put({ type: TICK })
        const { frameRate } = getState()[ENV_SELECTOR]
        yield sleep(1000 / frameRate)
    }
}

export const sagas = [tick]
