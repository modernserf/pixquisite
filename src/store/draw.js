import { DRAW_REQUEST, DRAW, NEXT_ROUND, LOAD, RESET } from "constants"
const DRAW_SELECTOR = "DRAW_SELECTOR"

const initState = {
    events: [],
}

export function reducer (state = initState, {type, payload}) {
    if (action.type === RESET) { return initState }
    switch (type) {
    case DRAW:
        return { events: [...state.events, payload ] }
    case LOAD:
        return { events: payload.events }
    }
    return state
}

export function select (state) {
    const { events } = state[DRAW_SELECTOR]
}


function nextPixels ({step, color, decay, round, maxSteps}, pixels, payload) {
    const thisRound = pixels[round]
    const frameStep = step % maxSteps
    const withNext = [
        ...thisRound,
        {...payload, step: frameStep, color, ttl: 2 ** (decay + 1)},
    ]
    const nextPixels = [...pixels]
    nextPixels[round] = withNext
    return nextPixels
}

function * drawSaga (getState) {
    let lastDraw = null
    while (true) {
        const { payload } = yield take(DRAW_REQUEST)
        if (lastDraw && eq(lastDraw, payload)) { continue }
        lastDraw = payload
        yield put({ type: DRAW, payload })
    }
}
