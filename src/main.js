import "babel-polyfill"
import { reducer } from "store"
import { mount, render } from "view"

document.addEventListener("DOMContentLoaded", () => {
    var _state = reducer(undefined, {type: "__INIT"})
    // var actionLog = []

    const ref = {}

    const dispatch = (action) => {
        if (typeof action === "function") {
            action(dispatch, () => _state)
            return
        }
        var nextState = reducer(_state, action)
        // actionLog.push(action)
        if (nextState === _state) { return }
        if (ref.dom) {
            render(nextState, ref.dom)
        }
        _state = nextState
    }

    ref.dom = mount(dispatch)
})
