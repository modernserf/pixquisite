import { h, render } from "preact";
import { createStore, applyMiddleware, compose } from "redux";
import predux from "preact-redux";
import thunkMiddleware from "redux-thunk";
import { schema, runTicks } from "./store/index";
import { ActiveGame } from "./view/ActiveGame";
import { CompleteGame } from "./view/CompleteGame";

const { Provider } = predux;

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

window.document.addEventListener("DOMContentLoaded", () => {
    const rootComponent = window.location.pathname.match("play")
        ? ActiveGame
        : CompleteGame;

    if (window.location.search) {
        const id = window.location.search.replace("?id=", "");
        store.dispatch({ type: "load", id });
    }

    render(
        h(Provider, { store }, [h(rootComponent)]),
        window.document.getElementById("app")
    );
});
