import { routeReducer } from "react-router-redux"
import { combineReducers } from "redux"
import { ROUTE_SELECTOR } from "constants"
import { reducer as drawReducer, selector as dSelector,
    sagas as drawSagas } from "./draw"
import { reducer as tReducer, selector as tSelector,
    sagas as tSagas } from "./transient"
import { sagas as actionSagas } from "actions"

export const reducer = combineReducers({
    [ROUTE_SELECTOR]: routeReducer,
    [dSelector]: drawReducer,
    [tSelector]: tReducer,
})

export const sagas = [...drawSagas, ...tSagas, ...actionSagas]

// export function select (state) {
//     const res = {
//         ...state[playSelector],
//         ...state[envSelector],
//     }
//     res.step = res.step % res.maxSteps
//     res.getColor = (colorName) =>
//         colorMap[colorName] || colorMap[state.rainbowColor]
//     res.colors = colors
//     return res
// }
//
// export function selectSaved (state) {
//     return {pixels: state[playSelector].pixels}
// }
//
// export function selectCompleted (state) {
//     const res = {
//         ...state[playSelector],
//         ...state[envSelector],
//         complete: true,
//     }
//     res.round = Math.floor(res.step / res.maxSteps) % res.pixels.length
//     res.step = res.step % res.maxSteps
//     res.getColor = (colorName) =>
//         colorMap[colorName] || colorMap[state.rainbowColor]
//     res.colors = colors
//
//     return res
// }
//
// export function selectRouter (state) {
//     return state[ROUTE_SELECTOR]
// }
