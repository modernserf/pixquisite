import "babel-polyfill"
import DOM from "react-dom"
import { createStore, applyMiddleware, compose } from "redux"
import { createRouterMiddleware } from "redux-antirouter"
import sagaMiddleware from "redux-saga"
import { reducer, sagas } from "./store"
import view from "./view"
import { schema, selectors } from "./constants"


const routeMiddleware = createRouterMiddleware({
    onChange: (location) => schema.actionCreators.route_changed(location),
    selectRoute: (state) => state[selectors.route],
})

const store = createStore(
    reducer,
    compose(
        applyMiddleware(
            routeMiddleware,
            sagaMiddleware(...sagas)),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f))

document.addEventListener("DOMContentLoaded", () => {
    DOM.render(view(store, reducer),
    document.getElementById("app"))
})
