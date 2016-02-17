import {
    PATCH, TICK, PLAY, STEP, DRAW, DRAW_REQUEST, SEEK, SET_COLOR,
    RESET, NEXT_ROUND, DONE, DONE_REQUEST, SET_SPEED, LOAD, LOAD_REQUEST,
    ENV_SELECTOR,
} from "constants"
import { selectSaved } from "store"
import { pushPath } from "redux-simple-router"
import { take, put, call } from "redux-saga"

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
        yield take(RESET)
        yield put(pushPath("/play"))
    }
}

// TODO: 404 page (maybe an animation!)
function * loadEffects () {
    while (true) {
        const { payload: id } = yield take(LOAD_REQUEST)
        try {
            const payload = yield call(api.load, id)
            yield put({ type: LOAD, payload })
        } catch (e) {
            console.error("No data for this page.")
        }
    }
}



function * doneSaga (getState) {
    while (true) {
        yield take(DONE_REQUEST)
        // TODO: do something while waiting
        try {
            const data = selectSaved(getState())
            const res = yield call(api.save, data)
            yield put(pushPath(`/watch/${res.id}`))
            yield put({ type: DONE, payload: res })
        } catch (e) {
            // TODO: handle error
        }
    }
}

export const sagas = [
    resetEffects, loadEffects, drawSaga, doneSaga,
]

export const load = (id) => ({ type: LOAD_REQUEST, payload: id })
export const patch = (payload) => ({ type: PATCH, payload })
export const draw = (payload) => ({ type: DRAW_REQUEST, payload })
export const done = () => ({ type: DONE_REQUEST })
export const play = () => ({ type: PLAY })
export const step = () => ({ type: STEP })
export const seek = (payload) => ({ type: SEEK, payload })
export const setSpeed = (payload) => ({ type: SET_SPEED, payload })
export const setColor = (payload) => ({ type: SET_COLOR, payload })
export const nextRound = () => ({ type: NEXT_ROUND })
export const reset = () => ({type: RESET})

function eq (a, b) {
    if (a === b) { return true }
    for (const key in a) {
        if (a[key] !== b[key]) { return false }
    }
    return true
}
