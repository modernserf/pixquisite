import { createConnector, createSchema, reducer, selector } from "redeclare";
import { connect as reduxConnect } from "react-redux";
import { draw, drawEvents, drawFrames } from "./draw";
import { transients } from "./transient";
import { encodeString } from "./codec";
import { env } from "../constants";

const { frameRate } = env;

export const schema = createSchema(
    {
        tick: [], // game clock signal
        play: [], // set play mode to playing
        step: [], // set play mode to stepping
        draw: drawThunk, // write a pixel to the animation with the current pixel settings
        seek: ["position"], // move the play head to position
        setColor: ["color"], // set draw color
        setSpeed: ["speed"], // set draw ttl
        done: doneThunk, // save animation, go to sharing URL
        reset: [], // clear animation, go to play screen
        load: ["id"], // load animation from URL
        routeChanged: ["location"],
        toPlay: []
    },
    {
        route: reducer(
            {
                routeChanged: (state, { location }) => location,
                toPlay: () => ({ query: {}, path: ["play"] }),
                reset: () => ({ query: {}, path: ["play"] }),
                done: (state, { id }) => ({ query: {}, path: ["view", id] })
            },
            {}
        ),
        draw,
        drawEvents,
        drawFrames,
        transients,
        grid: selector("drawFrames", "transients", (
            drawFrames,
            { colorStep }
        ) =>
            Object.assign({}, drawFrames, { colorStep }))
    }
);

let lastPayload = {};
function drawThunk(x, y) {
    return (dispatch, getState) => {
        const { step, decay, color } = schema.selectors.transients(getState());
        const payload = { x, y, step, decay, color };

        if (
            lastPayload.x === payload.x &&
                lastPayload.y === payload.y &&
                lastPayload.color === payload.color &&
                lastPayload.decay === payload.decay
        ) {
            return;
        }
        lastPayload = payload;

        dispatch({ type: "draw", payload });
    };
}

function doneThunk() {
    return (dispatch, getState) => {
        const events = schema.selectors.drawEvents(getState());
        const id = encodeString(events);
        dispatch({ type: "done", id });
    };
}

export function runTicks(store) {
    setInterval(
        () => {
            store.dispatch(schema.actions.tick());
        },
        1000 / frameRate
    );
}

export const connect = createConnector(schema, reduxConnect);
