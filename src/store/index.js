import { routeReducer } from "redux-simple-router"
import { combineReducers } from "redux"
import { ROUTE_SELECTOR, colors, colorMap,
    SET_RAINBOW, rainbowCycle } from "constants"
import {
    selector as playSelector, reducer as playReducer,
} from "./play"
import {
    selector as envSelector, reducer as envReducer,
} from "./env"

export const reducer = combineReducers({
    [playSelector]: playReducer,
    [ROUTE_SELECTOR]: routeReducer,
    [envSelector]: envReducer,
    rainbowColor: rainbowReducer,
})

function rainbowReducer (state = rainbowCycle[0], {type, payload}) {
    switch (type) {
    case SET_RAINBOW:
        return payload
    }
    return state
}

export function select (state) {
    const res = {
        ...state[playSelector],
        ...state[envSelector],
    }
    res.step = res.step % res.maxSteps
    res.getColor = (colorName) =>
        colorMap[colorName] || colorMap[state.rainbowColor]
    res.colors = colors
    return res
}

export function selectSaved (state) {
    return {pixels: state[playSelector].pixels}
}

export function selectCompleted (state) {
    const res = {
        ...state[playSelector],
        ...state[envSelector],
        complete: true,
    }
    res.round = Math.floor(res.step / res.maxSteps) % res.pixels.length
    res.step = res.step % res.maxSteps
    res.getColor = (colorName) =>
        colorMap[colorName] || colorMap[state.rainbowColor]
    res.colors = colors

    return res
}

export function selectRouter (state) {
    return state[ROUTE_SELECTOR]
}
