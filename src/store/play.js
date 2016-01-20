import {
    colors,
    PLAY_SELECTOR,
    TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, RESET, SET_SPEED,
    NEXT_ROUND, DONE, LOAD,
} from "constants"

export const selector = PLAY_SELECTOR

// state
const initState = {
    step: 0,
    pixels: [[]],
    round: 0,
    decay: 2,
    mode: STEP,
    color: colors[0],
}

// TODO: better way of integrating global env and this reducer?
const maxSteps = 32

function step ({mode, maxSteps}, state, {type, payload}) {
    switch (type) {
    case TICK:
        return nextStep(state, maxSteps)
    case DRAW:
        return mode === STEP ? nextStep(state, maxSteps) : state
    case NEXT_ROUND:
    case DONE:
    case LOAD:
        return 0
    case SEEK:
        return payload % maxSteps
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

function pixels (parentState, state, {type, payload}) {
    switch (type) {
    case DRAW:
        return nextPixels(parentState, state, payload)
    case NEXT_ROUND:
        return [...state, []]
    case LOAD:
        return payload.pixels
    }
    return state
}

export function reducer (state = initState, action) {
    switch (action.type) {
    case RESET:
        return initState
    case SET_COLOR:
        return { ...state, color: action.payload }
    case SET_SPEED:
        return { ...state, decay: action.payload }
    }

    return {
        ...state,
        step: step({mode: state.mode, maxSteps}, state.step, action),
        mode: mode(state.mode, action),
        round: round(state.round, action),
        pixels: pixels(state, state.pixels, action),
    }
}

function nextStep (step, maxSteps) {
    return (step + 1) % maxSteps
}

function nextPixels ({ step, color, decay, round }, pixels, payload) {
    const thisRound = pixels[round]
    const withNext = [
        ...thisRound,
        {...payload, step, color, ttl: 2 ** (decay + 1)},
    ]
    const nextPixels = [...pixels]
    nextPixels[round] = withNext
    return nextPixels
}
