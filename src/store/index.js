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
