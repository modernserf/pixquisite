import "babel-polyfill"
import DOM from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { createHistory } from "history"
import { syncReduxAndRouter } from "redux-simple-router"
import thunk from "redux-thunk"

import { localStorageKey } from "constants"
import { load } from "actions"
import { reducer } from "store"
import view from "view"

const store = applyMiddleware(thunk)(createStore)(reducer)
const history = createHistory()
syncReduxAndRouter(history, store, (s) => s.routing)

// hydrate state
var savedData = window.localStorage.getItem(localStorageKey)
if (savedData) {
    store.dispatch(load(savedData))
}

document.addEventListener("DOMContentLoaded", () => {
    DOM.render(view(store, history),
    document.getElementById("app"))
})
