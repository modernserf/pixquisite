import { ENV_SELECTOR, PATCH } from "constants"

const initState = {
    ttl: 8,
    width: 16,
    height: 16,
    maxSteps: 32,
    maxStepSpeed: 4,
    resolution: 24, // css px per cell
    frameRate: 12,
}

export const selector = ENV_SELECTOR

export function reducer (state = initState, {type, payload}) {
    switch (type) {
    case PATCH:
        return {...state, ...payload}
    }
    return state
}
