import {
    PLAY, STEP, DRAW_REQUEST, SEEK, SET_COLOR,
    RESET, DONE, DONE_REQUEST, SET_SPEED, LOAD, LOAD_REQUEST,
} from "constants"
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
        yield take(RESET)
        yield put(routeActions.push("/play"))
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
            const saved = selectSaved(getState())
            const res = yield call(api.save, saved)
            yield put({ type: DONE })
            yield put(routeActions.push(`/watch/${res.id}`))
        } catch (e) {
            // TODO: handle error
        }
    }
}

export const sagas = [
    resetEffects, loadEffects, doneSaga,
]

export const load = (id) => ({ type: LOAD_REQUEST, payload: id })
export const draw = (payload) => ({ type: DRAW_REQUEST, payload })
export const done = () => ({ type: DONE_REQUEST })
export const play = () => ({ type: PLAY })
export const step = () => ({ type: STEP })
export const seek = (payload) => ({ type: SEEK, payload })
export const setSpeed = (payload) => ({ type: SET_SPEED, payload })
export const setColor = (payload) => ({ type: SET_COLOR, payload })
export const reset = () => ({type: RESET})
