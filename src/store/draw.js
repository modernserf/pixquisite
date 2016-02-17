import { DRAW_SELECTOR, DRAW_REQUEST, DRAW, LOAD, RESET } from "constants"
import { take, put } from "redux-saga/effects"
import { select as selectT } from "store/transient"
import { sleep } from "util/sleep"
import { env } from "constants"

const { maxSteps, width } = env

const initState = {
    events: [],
    frames: [],
}

export function reducer (state = initState, {type, payload}) {
    if (type === RESET) { return initState }
    switch (type) {
    case DRAW:
        return {
            events: [...state.events, payload],
            frames: addToFrame(state.frames, payload),
        }
    case LOAD:
        return {
            events: payload.events,
            frames: payload.events.reduce(addToFrame, []),
        }
    }
    return state
}

export const selector = DRAW_SELECTOR

export function select (state) {
    const { frames } = state[DRAW_SELECTOR]
    const { step, round } = selectT(state)
    const currentIndex = frameForState(step, round)

    return { frames, currentIndex }
}

export const sagas = [drawSaga]

function * drawSaga (getState) {
    while (true) {
        const { payload } = yield take(DRAW_REQUEST)
        const { step, round, decay, color } = selectT(getState())
        const ttl = 2 ** (decay + 1)
        const fullPayload = { ...payload, step, round, ttl, color }
        yield put({ type: DRAW, payload: fullPayload })
        yield sleep(50) // debounce
    }
}

const frameForState = (step, round) => step + (round * maxSteps)

function addToFrame (frames, event) {
    const { x, y, step, round, ttl, color } = event
    for (let i = 0; i < ttl; i++) {
        const f = frameForState(step + i, round)
        const s = (y * width) + x
        if (!frames[f]) frames[f] = []
        frames[f][s] = { color }
    }
    return frames
}
