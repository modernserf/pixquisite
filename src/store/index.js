import { routeReducer } from "redux-simple-router"
import { combineReducers } from "redux"
import { ROUTE_SELECTOR } from "constants"
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
})

export function select (state) {
    const res = {
        ...state[playSelector],
        ...state[envSelector],
    }
    res.step = res.step % res.maxSteps
    return res
}

export function selectCompleted (state) {
    const res = {
        ...state[playSelector],
        ...state[envSelector],
        complete: true,
    }
    res.round = Math.floor(res.step / res.maxSteps)
    res.step = res.step % res.maxSteps
    return res
}

export function selectRouter (state) {
    return state[ROUTE_SELECTOR]
}
