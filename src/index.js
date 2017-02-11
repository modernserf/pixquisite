import "babel-polyfill";
import DOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createRouterMiddleware } from "redux-antirouter";
import { schema, runTicks } from "./store";
import view from "./view";

const routeMiddleware = createRouterMiddleware({
    onChange: location => schema.actions.routeChanged(location),
    selectRoute: schema.selectors.route
});

const composeEnhancers = process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            actionsBlacklist: ["tick"]
        })
    : compose;

const store = createStore(
    schema.reducer,
    composeEnhancers(applyMiddleware(routeMiddleware, thunkMiddleware))
);

runTicks(store);

document.addEventListener("DOMContentLoaded", () => {
    DOM.render(view(store, schema.reducer), document.getElementById("app"));
});
