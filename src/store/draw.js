import { DRAW_SELECTOR, DRAW_REQUEST, DRAW, LOAD, RESET } from "constants"
import { take, put } from "redux-saga/effects"
import { select as selectT } from "store/transient"
import { env } from "constants"

const { maxSteps, width } = env

const initState = {
    events: [],
    frames: [], // note: this gets mutated!
}

export function reducer (state = initState, {type, payload}) {
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
    case RESET:
        console.log("reset")
        return {
            events: [],
            frames: [],
        }
    }
    return state
}

export const selector = DRAW_SELECTOR

export function selectSaved (state) {
    return { events: state[DRAW_SELECTOR].events }
}

export function select (state) {
    const { frames } = state[DRAW_SELECTOR]
    const { step } = selectT(state)
    const currentIndex = step % maxSteps

    return { frames, currentIndex }
}

export const sagas = [drawSaga]

function * drawSaga (getState) {
    let lastPayload = {}
    while (true) {
        const { payload } = yield take(DRAW_REQUEST)
        const { step, decay, color } = selectT(getState())
        const ttl = 2 ** (decay + 1)
        const fullPayload = { ...payload, step, ttl, color }

        if (lastPayload.x === fullPayload.x &&
            lastPayload.y === fullPayload.y &&
            lastPayload.color === fullPayload.color &&
            lastPayload.ttl === fullPayload.ttl) {
            continue
        }
        lastPayload = fullPayload

        yield put({ type: DRAW, payload: fullPayload })
    }
}

function addToFrame (frames, event) {
    const nextFrames = [...frames]
    const { x, y, step, ttl, color } = event
    for (let i = 0; i < ttl; i++) {
        const f = (step + i) % maxSteps
        const s = (y * width) + x
        if (!nextFrames[f]) nextFrames[f] = []
        nextFrames[f][s] = { color }
    }
    return nextFrames
}
