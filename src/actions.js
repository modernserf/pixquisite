import { selectSaved } from "store/draw"
import { routeActions } from "react-router-redux"
import { take, put, call } from "redux-saga/effects"

const api = {
    load: (id) => window.fetch(`/game/${id}`).then((r) => r.json()),
    save: (data) => window.fetch(`/game`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: new window.Headers({"Content-Type": "application/json"}),
    }).then((r) => r.json()),
}

function * resetEffects () {
    while (true) {
        yield take("reset")
        yield put(routeActions.push("/play"))
    }
}

// TODO: 404 page (maybe an animation!)
function * loadEffects () {
    while (true) {
        const { payload: id } = yield take("load_request")
        try {
            const payload = yield call(api.load, id)
            yield put({ type: "load", payload })
        } catch (e) {
            console.error("No data for this page.")
        }
    }
}

function * doneSaga (getState) {
    while (true) {
        yield take("done_request")
        // TODO: do something while waiting
        try {
            const saved = selectSaved(getState())
            const res = yield call(api.save, saved)
            yield put({ type: "done" })
            yield put(routeActions.push(`/watch/${res.id}`))
        } catch (e) {
            // TODO: handle error
        }
    }
}

export const sagas = [
    resetEffects, loadEffects, doneSaga,
]
