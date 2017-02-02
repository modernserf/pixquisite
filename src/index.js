import "babel-polyfill";
import DOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { createRouterMiddleware } from "redux-antirouter";
import sagaMiddleware from "redux-saga";
import { schema, sagas } from "./store";
import view from "./view";

const routeMiddleware = createRouterMiddleware({
    onChange: location => schema.actions.routeChanged(location),
    selectRoute: schema.selectors.route
});

const composeEnhancers = process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            actionsBlacklist: ["tick", "EFFECT_RESOLVED", "EFFECT_TRIGGERED"]
            // Specify extension’s options like name, actionsBlacklist, actionsCreators or immutablejs support if needed
        })
    : compose;

const store = createStore(
    schema.reducer,
    composeEnhancers(applyMiddleware(routeMiddleware, sagaMiddleware(...sagas)))
);

document.addEventListener("DOMContentLoaded", () => {
    DOM.render(view(store, schema.reducer), document.getElementById("app"));
});
