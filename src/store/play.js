import {
    speeds,
    PLAY_SELECTOR,
    TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, RESET, SET_SPEED,
    NEXT_ROUND, DONE,
} from "constants"

export const selector = PLAY_SELECTOR

// state
const initState = {
    step: 0,
    pixels: [[]],
    round: 0,
    stepSpeed: 3,
    mode: STEP,
    color: "black",
}

export function reducer (state = initState, { type, payload }) {
    switch (type) {
    case TICK:
        return {
            ...state,
            step: nextStep(state),
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
    case RESET:
        return initState
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
        }
    }
    return state
}

function nextStepAtSpeed ({step, stepSpeed}) {
    const speed = speeds[stepSpeed]
    return (step + speed)
}

function nextStep ({step}) {
    return (step + 1)
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
