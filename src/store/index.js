import { take, put } from "redux-saga/effects";
import { createConnector, createSchema, reducer, selector } from "redeclare";
import { connect as reduxConnect } from "react-redux";
import { draw, drawEvents, drawFrames } from "./draw";
import { transients } from "./transient";
import { encodeString } from "./codec";
import { sleep } from "../util/sleep";
import { env } from "../constants";

const { frameRate } = env;

export const schema = createSchema(
    {
        tick: [], // game clock signal
        play: [], // set play mode to playing
        step: [], // set play mode to stepping
        draw__request: ["x", "y"], // coordinates for drawing pixel
        draw: ["payload"], // write a pixel to the animation with the current pixel settings
        seek: ["position"], // move the play head to position
        setColor: ["color"], // set draw color
        setSpeed: ["speed"], // set draw ttl
        done__request: [],
        done: ["id"], // save animation, go to sharing URL
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

function* drawSaga(getState) {
    let lastPayload = {};
    while (true) {
        const { x, y } = yield take("draw__request");
        const { step, decay, color } = schema.selectors.transients(getState());
        const payload = { x, y, step, decay, color };

        if (
            lastPayload.x === payload.x &&
                lastPayload.y === payload.y &&
                lastPayload.color === payload.color &&
                lastPayload.decay === payload.decay
        ) {
            continue;
        }
        lastPayload = payload;

        yield put(schema.actions.draw(payload));
    }
}

function* doneSaga(getState) {
    while (true) {
        yield take("done__request");
        const events = schema.selectors.drawEvents(getState());
        const id = encodeString(events);
        yield put(schema.actions.done(id));
    }
}

function* tick() {
    while (true) {
        yield put(schema.actions.tick());
        yield sleep(1000 / frameRate);
    }
}

export const sagas = [drawSaga, tick, doneSaga];
export const connect = createConnector(schema, reduxConnect);
