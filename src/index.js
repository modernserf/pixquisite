import DOM from "react-dom"
import { createStore, applyMiddleware, compose } from "redux"
import { hashHistory } from "react-router"
import { syncHistory } from "react-router-redux"
import sagaMiddleware from "redux-saga"
import { reducer, sagas } from "./store"
import view from "./view"
import { schema, selectors } from "./constants"



const routeMiddleware = syncHistory(hashHistory)

const store = createStore(
    reducer,
    compose(
        applyMiddleware(
            routeMiddleware,
            sagaMiddleware(...sagas),
            schema.createMiddleware()),
        window.devToolsExtension ? window.devToolsExtension() : (f) => f))

routeMiddleware.listenForReplays(store,
    (state) => state[selectors.route].location)

document.addEventListener("DOMContentLoaded", () => {
    DOM.render(view(store, hashHistory),
    document.getElementById("app"))
})
