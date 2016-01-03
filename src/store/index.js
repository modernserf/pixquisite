import {
    TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, LOAD, RESET, SAVE, SET_SPEED,
    NEXT_ROUND, DONE, PATCH,
} from "constants"

// state
const initState = {
    step: 0,
    pixels: [[]],
    round: 0,
    stepSpeed: 4,
    mode: STEP,
    color: "black",
    saveState: "",
    ttl: 8,
    width: 16,
    height: 16,
    maxSteps: 32,
    maxStepSpeed: 4,
    resolution: 24, // css px per cell
    frameRate: 12,
    complete: false,
}

export function reducer (state = initState, {type, payload}) {
    switch (type) {
    case PATCH:
        return { ...state, ...payload }
    case TICK:
        return {
            ...state,
            step: nextStep(state),
            round: state.complete && state.step === (state.maxSteps - 1)
                ? (state.round + 1) % state.pixels.length
                : state.round,
        }
    case PLAY:
    case STEP:
        return state.mode === type
            ? state
            : { ...state, mode: type }
    case SET_SPEED:
        return { ...state, stepSpeed: payload }
    case DRAW:
        return {
            ...state,
            pixels: nextPixels(state, payload),
            step: state.mode === STEP
                ? nextStepAtSpeed(state)
                : state.step,
        }
    case SEEK:
        return {
            ...state,
            step: payload,
            mode: state.mode === PLAY ? STEP : state.mode,
        }
    case SET_COLOR:
        return { ...state, color: payload }
    case LOAD:
        return {
            ...initState,
            pixels: payload,
            saveState: JSON.stringify(payload),
        }
    case RESET:
        return initState
    case SAVE:
        return { ...state, saveState: JSON.stringify(state.pixels) }
    case NEXT_ROUND:
        return {
            ...state,
            mode: STEP,
            step: 0,
            round: state.round + 1,
            pixels: [...state.pixels, []],
        }
    case DONE:
        return {
            ...state,
            mode: STEP,
            step: 0,
            round: 0,
            complete: true,
        }
    }
    return state
}

const speeds = [1 / 8, 1 / 4, 1 / 2, 1, 2]

function nextStepAtSpeed ({step, maxSteps, stepSpeed}) {
    const speed = speeds[stepSpeed]
    return (step + speed) % maxSteps
}

function nextStep ({step, maxSteps}) {
    return (step + 1) % maxSteps
}

function nextPixels (state, payload) {
    const thisRound = state.pixels[state.round]
    const withNext = [
        ...thisRound,
        {...payload, step: state.step, color: state.color},
    ]
    const nextPixels = [...state.pixels]
    nextPixels[state.round] = withNext
    return nextPixels
}
