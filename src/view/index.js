import React from "react"
import { Provider, connect } from "react-redux"
import { LinkProvider } from "redux-antirouter"

import "./reset.css"
import "./style.css"
import { Home } from "./Home"
import { ActiveGame } from "./ActiveGame"
import { CompleteGame } from "./CompleteGame"

const routes = [
    { route: undefined, component: Home },
    { route: "play", component: ActiveGame },
    { route: "view", component: CompleteGame }
]

const Router = connect((state) => state.route)(
    ({ path, location }) => {
        const route = path[0]
        const Component = routes.find((r) => r.route === route).component
        return <Component />
    }
)

export default function (store, rootReducer) {
    return (
        <Provider store={store}>
            <LinkProvider selectRoute={(state) => state.route} rootReducer={rootReducer}>
                <Router />
            </LinkProvider>
        </Provider>
    )
}
