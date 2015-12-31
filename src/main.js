import "babel-polyfill"
// dom
var $grid = document.getElementById("grid")
var $play = document.getElementById("play")
var $stop = document.getElementById("stop")
var $slider = document.getElementById("slider")
var $colors = document.getElementById("colors")
var $storage = document.getElementById("storage")
var $load = document.getElementById("load")
var $save = document.getElementById("save")
var $clear = document.getElementById("clear")

document.addEventListener("DOMContentLoaded", () => {
    // hydrate state
    var savedData = window.localStorage.getItem(localStorageKey)
    if (savedData) {
        $storage.value = savedData
        load(savedData)
    }

    $grid.addEventListener("mousedown", (e) => {
        dispatch({
            type: DRAW,
            payload: {
                x: Math.round(e.offsetX / resolution),
                y: Math.round(e.offsetY / resolution),
            },
        })
    })

    $play.addEventListener("click", () => {
        dispatch({type: PLAY})
    })

    $stop.addEventListener("click", () => {
        dispatch({type: STOP})
    })

    $slider.addEventListener("input", (e) => {
        dispatch({
            type: SEEK,
            payload: Number(e.target.value),
        })
    })

    $colors.addEventListener("change", (e) => {
        dispatch({
            type: SET_COLOR,
            payload: e.target.value,
        })
    })

    $load.addEventListener("click", (e) => {
        load($storage.value)
    })

    $save.addEventListener("click", (e) => {
        var stateJSON = JSON.stringify(_state.pixels)
        window.localStorage.setItem(localStorageKey, stateJSON)
        $storage.value = stateJSON
    })

    $clear.addEventListener("click", (e) => {
        window.localStorage.removeItem(localStorageKey)
        $storage.value = ""
        dispatch({type: RESET})
    })
})

// action creators
function load (text) {
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

// constants
var ttl = 64
var width = 32
var height = 32
var maxSteps = 128
var resolution = 8 // CSS px per grid px
var localStorageKey = "pixquisite-v1"

// actions
var TICK = "TICK"
var PLAY = "PLAY"
var STOP = "STOP"
var DRAW = "DRAW"
var SEEK = "SEEK"
var SET_COLOR = "SET_COLOR"
var LOAD = "LOAD"
var RESET = "RESET"

// state
var initState = {
    step: 0,
  // stored as `${x}-${y}`: { x, y, step }
    pixels: {},
    playing: false,
    color: "black",
}
var _state = initState

var actionLog = []

function reducer (state, action) {
    switch (action.type) {
    case TICK:
        return state.playing ? {...state, step: nextStep(state.step)} : state
    case PLAY:
        return state.playing ? state : {...state, playing: true}
    case STOP:
        return state.playing ? {...state, playing: false} : state
    case DRAW:
        return {
            ...state,
            pixels: {...state.pixels, ...nextPixel(state, action.payload)},
            step: state.playing ? state.step : nextStep(state.step),
        }
    case SEEK:
        return {...state, step: action.payload, playing: false}
    case SET_COLOR:
        return {...state, color: action.payload}
    case LOAD:
        return { ...initState, pixels: action.payload }
    case RESET:
        return initState
    }
    return state
}

// render
var ctx = $grid.getContext("2d")

function render (state) {
    ctx.clearRect(0, 0, width * resolution, height * resolution)
    for (var key in state.pixels) {
        let px = state.pixels[key]
        if (px.step < state.step && // made before current step
            px.step + ttl > state.step) { // not older than ttl
            ctx.fillStyle = px.color
            ctx.fillRect(px.x * resolution, px.y * resolution, resolution, resolution)
        }
    }
    $slider.value = state.step
    if (state.playing) {
        window.requestAnimationFrame(nextTick)
    }
}

function nextTick () { dispatch({ type: TICK }) }

function dispatch (action) {
    actionLog.push(action)
    var nextState = reducer(_state, action)
    // console.log(nextState,actionLog)
    if (nextState === _state) { return }
    render(nextState)
    _state = nextState
}

// helpers
function nextStep (step) {
    return (step + 1) % maxSteps
}

function nextPixel (state, pixel) {
    return {
        [`${pixel.x}-${pixel.y}`]: {
            ...pixel,
            color: state.color,
            step: state.step,
        },
    }
}
