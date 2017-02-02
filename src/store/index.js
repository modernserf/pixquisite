import { combineReducers } from "redux"
import { take, put } from "redux-saga/effects"
import { selectors } from "../constants"
import {
    reducer as drawReducer,
    selector as dSelector,
    selectSaved,
    sagas as drawSagas,
} from "./draw"
import {
    reducer as tReducer,
    selector as tSelector,
    sagas as tSagas,
} from "./transient"
import { encodeString } from "./codec"

function * doneSaga (getState) {
    while (true) {
        yield take("done_request")
        const { events } = selectSaved(getState())
        const id = encodeString(events)

        yield put({ type: "done" , payload: id })
    }
}

function routeReducer (state = {}, { type, payload }) {
    switch (type) {
    case "route_changed":
        return payload
    case "to_play":
    case "reset":
        return { query: {}, path: ['play'] }
    case "done":
        return { query: {}, path: ['view',payload] }
    default:
        return state
    }
}

export const reducer = combineReducers({
    [selectors.route]: routeReducer,
    [dSelector]: drawReducer,
    [tSelector]: tReducer,
})

export const sagas = [...drawSagas, ...tSagas, doneSaga]
