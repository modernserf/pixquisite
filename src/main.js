import "babel-polyfill"
import React from "react"
import DOM from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import thunk from "redux-thunk"

import { localStorageKey } from "constants"
import { load } from "actions"
import { reducer } from "store"
import { Main } from "view"

const store = applyMiddleware(
    thunk
)(createStore)(reducer)

// hydrate state
var savedData = window.localStorage.getItem(localStorageKey)
if (savedData) {
    store.dispatch(load(savedData))
}

document.addEventListener("DOMContentLoaded", () => {
    DOM.render(
        <Provider store={store}>
            <Main/>
        </Provider>,
    document.getElementById("app"))
})
