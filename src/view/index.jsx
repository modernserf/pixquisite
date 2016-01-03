import React from "react"
import { Provider } from "react-redux"
import { Router, IndexRoute, Route } from "react-router"

import "./reset.css"
import "./style.css"
import { Home } from "./Home"
import { ActiveGame } from "./ActiveGame"

export default function (store, history) {
    return (
        <Provider store={store}>
            <Router history={history}>
                <Route path="/">
                    <IndexRoute component={Home}/>
                    <Route path="/play" component={ActiveGame}/>
                    <Route path="/games/:id" component={CompleteGame}/>
                </Route>
            </Router>
        </Provider>
    )
}

function CompleteGame () {
    return <div >TODO</div>
}
