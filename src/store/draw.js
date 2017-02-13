import { reducer, selector } from "redeclare";
import { env } from "../constants";
import { decodeString } from "./codec";

const { maxSteps, width } = env;
const makeInitState = () => ({
    events: [],
    frames: [] // note: this gets mutated!
});

export const draw = reducer(
    {
        draw: (state, { payload }) => ({
            events: [...state.events, payload],
            frames: addToFrame(state.frames, payload)
        }),
        load: (state, { id }) => {
            const events = decodeString(id);
            return {
                events: events,
                frames: events.reduce(addToFrame, [])
            };
        }
    },
    makeInitState()
);

export const drawEvents = selector("draw", draw => draw.events);

export const drawFrames = selector("draw", "transients", (
    { frames },
    { step }
) => {
    const currentIndex = step % maxSteps;
    return { frames, currentIndex };
});

function addToFrame(frames, event) {
    const nextFrames = [...frames];
    const { x, y, step, decay, color } = event;
    const ttl = 1 << decay + 1;

    for (let i = 0; i < ttl; i++) {
        const f = (step + i) % maxSteps;
        const s = y * width + x;
        if (!nextFrames[f]) nextFrames[f] = [];
        nextFrames[f][s] = { color };
    }
    return nextFrames;
}
