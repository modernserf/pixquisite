import { selectSaved } from "./store/draw"
import { routeActions } from "react-router-redux"
import { take, put } from "redux-saga/effects"
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

export const sagas = [
    resetEffects, doneSaga,
]
