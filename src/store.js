import {
    maxSteps,
    TICK, PLAY, STEP, PARK, DRAW, SEEK, SET_COLOR, LOAD, RESET,
} from "constants"

// state
const initState = {
    step: 0,
  // stored as `${x}-${y}`: { x, y, step }
    pixels: {},
    mode: STEP,
    color: "black",
}

export function reducer (state = initState, action) {
    switch (action.type) {
    case TICK:
        return {...state, step: nextStep(state.step)}
    case PLAY:
    case STEP:
    case PARK:
        return state.mode === action.type
            ? state
            : { ...state, mode: action.type }
    case DRAW:
        return {
            ...state,
            pixels: {...state.pixels, ...nextPixel(state, action.payload)},
            step: state.mode === STEP
                ? nextStep(state.step)
                : state.step,
        }
    case SEEK:
        return {
            ...state,
            step: action.payload,
            mode: state.mode === PLAY ? STEP : state.mode,
        }
    case SET_COLOR:
        return { ...state, color: action.payload }
    case LOAD:
        return { ...initState, pixels: action.payload }
    case RESET:
        return initState
    }
    return state
}

function nextStep (step) {
    return (step + 1) % maxSteps
}

function nextPixel (state, pixel) {
    return {
        [`${pixel.x}-${pixel.y}`]: {
            ...pixel,
            color: state.color,
            step: state.step,
        },
    }
}
