import {
    frameRateMs, localStorageKey,
    RESET, LOAD, PLAY, TICK,
} from "constants"

// action creators
export const load = (text) => (dispatch) => {
    if (!text) {
        dispatch({type: RESET})
    }
    try {
        var state = JSON.parse(text)
        dispatch({type: LOAD, payload: state})
    } catch (e) {
        window.alert("Invalid saved state.")
    }
}

export const tick = () => (dispatch, getState) => {
    if (getState().mode === PLAY) {
        dispatch({ type: TICK })
        window.setTimeout(() => dispatch(tick()), frameRateMs)
    }
}

// TODO: $storage.value should be handled in render()
export const save = ($storage) => (dispatch, getState) => {
    var stateJSON = JSON.stringify(getState().pixels)
    window.localStorage.setItem(localStorageKey, stateJSON)
    $storage.value = stateJSON
}
