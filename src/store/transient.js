import { colorMap, playModes, env } from "../constants";

const { maxSteps } = env;

const patchOn = (matchType, key) =>
    (prevState, action) => action.type === matchType ? action[key] : prevState;

const initState = {
    step: 0,
    decay: 2,
    mode: playModes.step,
    color: Object.keys(colorMap)[0],
    colorStep: 0
};
export function transients(state = initState, action) {
    if (action.type === "reset") {
        return initState;
    }

    return combineDependentReducers(state, action, {
        step,
        mode,
        colorStep,
        color: patchOn("setColor", "color"),
        decay: patchOn("setSpeed", "speed")
    });
}
function colorStep(state, { type }) {
    return type === "tick" ? state + 1 : state;
}

function step(state, action, { mode }) {
    switch (action.type) {
        case "tick":
            return mode === playModes.play ? (state + 1) % maxSteps : state;
        case "draw":
            return mode === playModes.step ? (state + 1) % maxSteps : state;
        case "done":
        case "load":
            return 0;
        case "seek":
            return action.position;
        default:
            return state;
    }
}

function mode(state, { type }) {
    switch (type) {
        case "step":
        case "seek":
        case "done":
            return playModes.step;
        case "play":
        case "load":
            return playModes.play;
        default:
            return state;
    }
}

const m = (a, b) => Object.assign({}, a, b);

function combineDependentReducers(state, action, subReducers) {
    Object.keys(subReducers).forEach(key => {
        const nextStateForKey = subReducers[key](state[key], action, state);
        if (nextStateForKey !== state[key]) {
            state = m(state, { [key]: nextStateForKey });
        }
    });
    return state;
}
