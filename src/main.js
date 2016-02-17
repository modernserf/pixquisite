import DOM from "react-dom"
import { createStore, applyMiddleware, compose } from "redux"
import { browserHistory } from "react-router"
import { syncHistory } from "react-router-redux"
import sagaMiddleware from "redux-saga"
import { reducer, sagas } from "store"
import view from "view"
import { ROUTE_SELECTOR } from "constants"

const routeMiddleware = syncHistory(browserHistory)

const store = createStore(
    reducer,
    compose(
        applyMiddleware(routeMiddleware, sagaMiddleware(...sagas)),
        window.devToolsExtension ? window.devToolsExtension() : (f) => f))

routeMiddleware.listenForReplays(store,
    (state) => state[ROUTE_SELECTOR].location)

document.addEventListener("DOMContentLoaded", () => {
    DOM.render(view(store, browserHistory),
    document.getElementById("app"))
})
