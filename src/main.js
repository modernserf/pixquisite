import "babel-polyfill"
import "whatwg-fetch"
import DOM from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { createHistory } from "history"
import { syncReduxAndRouter } from "redux-simple-router"
import thunk from "redux-thunk"

import { reducer, selectRouter } from "store"
import view from "view"

const store = applyMiddleware(thunk)(createStore)(reducer)
const history = createHistory()
syncReduxAndRouter(history, store, selectRouter)

document.addEventListener("DOMContentLoaded", () => {
    DOM.render(view(store, history),
    document.getElementById("app"))
})
