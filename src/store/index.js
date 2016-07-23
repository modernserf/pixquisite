import { routeActions, routeReducer } from "react-router-redux"
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

function * resetEffects () {
    while (true) {
        yield take("reset")
        yield put(routeActions.push("/play"))
    }
}

function * doneSaga (getState) {
    while (true) {
        yield take("done_request")
        const { events } = selectSaved(getState())
        const id = encodeString(events)

        yield put({ type: "done" })
        yield put(routeActions.push(`/watch/${id}`))
    }
}

export const reducer = combineReducers({
    [selectors.route]: routeReducer,
    [dSelector]: drawReducer,
    [tSelector]: tReducer,
})

export const sagas = [...drawSagas, ...tSagas, resetEffects, doneSaga]
