import { selectors, schema } from "constants"
import { take, put } from "redux-saga/effects"
import { select as selectT } from "store/transient"
import { env } from "constants"

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
    load: (state, { events }) => ({
        events: events,
        frames: events.reduce(addToFrame, []),
    }),
    reset: () => {
        console.log("reset")
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
        const ttl = 2 ** (decay + 1)
        const fullPayload = { ...payload, step, ttl, color }

        if (lastPayload.x === fullPayload.x &&
            lastPayload.y === fullPayload.y &&
            lastPayload.color === fullPayload.color &&
            lastPayload.ttl === fullPayload.ttl) {
            continue
        }
        lastPayload = fullPayload

        yield put({ type: "draw", payload: fullPayload })
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
