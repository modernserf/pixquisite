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
/*
    env -- maxSteps, etc
    game -- everything else
    pixels -- LOAD, DRAW (takes env and game state)
*/

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
        return { ...state, decay: payload }
    case DRAW:
        return {
            ...state,
            pixels: nextPixels(state, payload),
            step: state.mode === STEP
                ? nextStep(state)
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
    case LOAD:
        return {
            ...state,
            pixels: payload.pixels,
        }
    }
    return state
}

function nextStep ({step}) {
    return (step + 1) % maxSteps
}

function nextPixels (state, payload) {
    const thisRound = state.pixels[state.round]
    const { step, color, decay } = state
    const withNext = [
        ...thisRound,
        {...payload, step, color, ttl: 2 ** (decay + 1)},
    ]
    const nextPixels = [...state.pixels]
    nextPixels[state.round] = withNext
    return nextPixels
}
