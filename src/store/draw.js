import { selectors, schema, env } from "../constants"
import { take, put } from "redux-saga/effects"
import { select as selectT } from "./transient"
import { decodeString } from "./codec"

const { maxSteps, width } = env

const makeInitState = () => ({
    events: [],
    frames: [], // note: this gets mutated!
})

export const reducer = schema.createReducer({
    draw: (state, payload) => ({
        events: [...state.events, payload],
        frames: addToFrame(state.frames, payload),
    }),
    load: (state, str) => {
        const events = decodeString(str)
        return {
            events: events,
            frames: events.reduce(addToFrame, []),
        }
    },
    reset: () => {
        return makeInitState()
    },
}, makeInitState())

export const selector = selectors.draw

export function selectSaved (state) {
    return { events: state[selectors.draw].events }
}

export function select (state) {
    const { frames } = state[selectors.draw]
    const { step } = selectT(state)
    const currentIndex = step % maxSteps

    return { frames, currentIndex }
}

export const sagas = [drawSaga]

function * drawSaga (getState) {
    let lastPayload = {}
    while (true) {
        const { payload } = yield take("draw_request")
        const { step, decay, color } = selectT(getState())
        const fullPayload = { ...payload, step, decay, color }

        if (lastPayload.x === fullPayload.x &&
            lastPayload.y === fullPayload.y &&
            lastPayload.color === fullPayload.color &&
            lastPayload.decay === fullPayload.decay) {
            continue
        }
        lastPayload = fullPayload

        yield put({ type: "draw", payload: fullPayload })
    }
}

function addToFrame (frames, event) {
    const nextFrames = [...frames]
    const { x, y, step, decay, color } = event
    const ttl = 2 ** (decay + 1)

    for (let i = 0; i < ttl; i++) {
        const f = (step + i) % maxSteps
        const s = (y * width) + x
        if (!nextFrames[f]) nextFrames[f] = []
        nextFrames[f][s] = { color }
    }
    return nextFrames
}
