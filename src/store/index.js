import {
    TICK, PLAY, STEP, DRAW, SEEK, SET_COLOR, LOAD, RESET, SAVE, PATCH,
} from "constants"

// state
const initState = {
    step: 0,
  // stored as `${x}-${y}`: { x, y, step }
    pixels: {},
    mode: STEP,
    color: "black",
    saveState: "",
    ttl: 16,
    width: 32,
    height: 32,
    maxSteps: 32,
    resolution: 12, // css px per cell
    frameRate: 12,

}

export function reducer (state = initState, {type, payload}) {
    switch (type) {
    case PATCH:
        return { ...state, ...payload }
    case TICK:
        return {...state, step: nextStep(state)}
    case PLAY:
    case STEP:
        return state.mode === type
            ? state
            : { ...state, mode: type }
    case DRAW:
        return {
            ...state,
            pixels: {...state.pixels, ...nextPixel(state, payload)},
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
    }
    return state
}

function nextStep ({step, maxSteps}) {
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
