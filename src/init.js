const { render } = require("preact");
const { createStore, applyMiddleware, compose } = require("redux");
const { default: thunkMiddleware } = require("redux-thunk");
import { schema, runTicks } from "./store/index";

export default function(onMount) {
    const composeEnhancers = process.env.NODE_ENV !== "production" &&
        typeof window === "object" &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                actionsBlacklist: ["tick"]
            })
        : compose;

    const store = createStore(
        schema.reducer,
        composeEnhancers(applyMiddleware(thunkMiddleware))
    );

    runTicks(store);

    document.addEventListener("DOMContentLoaded", () => {
        render(onMount(store), document.getElementById("app"));
    });
}
