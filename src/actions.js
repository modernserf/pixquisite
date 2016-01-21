import {
    PATCH, TICK, PLAY, STEP, DRAW, DRAW_REQUEST, SEEK, SET_COLOR,
    RESET, NEXT_ROUND, DONE, DONE_REQUEST, SET_SPEED, LOAD, LOAD_REQUEST,
    SET_RAINBOW, rainbowCycle,
} from "constants"
import { select, selectSaved } from "store"
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

const tick = loop(function * (getState) {
    const { mode, frameRate } = select(getState())
    yield sleep(1000 / frameRate)
    if (mode === PLAY) {
        yield put({ type: TICK })
    }
})

const resetEffects = loop(function * () {
    yield take(RESET)
    yield put(pushPath("/play"))
})

// TODO: 404 page (maybe an animation!)
const loadEffects = loop(function * () {
    const { payload: id } = yield take(LOAD_REQUEST)
    try {
        const payload = yield call(api.load, id)
        yield put({ type: LOAD, payload })
    } catch (e) {
        console.error("No data for this page.")
    }
})

function * drawSaga () {
    let lastDraw = null
    while (true) {
        const { payload } = yield take(DRAW_REQUEST)
        if (lastDraw && eq(lastDraw, payload)) { continue }
        lastDraw = payload
        yield put({ type: DRAW, payload })
    }
}

const doneSaga = loop(function * (getState) {
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
})

// rainbow is free-running cycle
const rainbow = function * () {
    let index = 0
    const max = rainbowCycle.length
    while (true) {
        yield put({ type: SET_RAINBOW, payload: rainbowCycle[index] })
        index = (index + 1) % max
        yield sleep(100)
    }
}

export const sagas = [
    tick, resetEffects, loadEffects, drawSaga, doneSaga, rainbow,
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

function loop (gen) {
    return function * (getState) {
        while (true) {
            yield* gen(getState)
        }
    }
}

function eq (a, b) {
    if (a === b) { return true }
    for (const key in a) {
        if (a[key] !== b[key]) { return false }
    }
    return true
}

function sleep (ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms)
    })
}
