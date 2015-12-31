import "babel-polyfill"
// dom
var $grid = document.getElementById("grid")
var $play = document.getElementById("play")
var $step = document.getElementById("step")
var $park = document.getElementById("park")
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
                x: Math.floor(e.offsetX / resolution),
                y: Math.floor(e.offsetY / resolution),
            },
        })
    })

    $play.addEventListener("click", () => {
        dispatch({type: PLAY})
    })

    $step.addEventListener("click", () => {
        dispatch({type: STEP})
    })

    $park.addEventListener("click", () => {
        dispatch({type: PARK})
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
var ttl = 32
var width = 32
var height = 32
var maxSteps = 64
var resolution = 12 // CSS px per grid px
var localStorageKey = "pixquisite-v1"
var frameRateMs = 1000 / 12

// actions
var TICK = "TICK"
var PLAY = "PLAY"
var STEP = "STEP"
var PARK = "PARK"
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
    mode: STEP,
    color: "black",
}
var _state = initState

var actionLog = []

function reducer (state, action) {
    switch (action.type) {
    case TICK:
        return {...state, step: nextStep(state.step)}
    case PLAY:
    case STEP:
    case PARK:
        return state.mode === action.type
            ? state
            : { ...state, mode: action.type }
    case DRAW:
        return {
            ...state,
            pixels: {...state.pixels, ...nextPixel(state, action.payload)},
            step: state.mode === STEP
                ? nextStep(state.step)
                : state.step,
        }
    case SEEK:
        return {
            ...state,
            step: action.payload,
            mode: state.mode === PLAY ? STEP : state.mode,
        }
    case SET_COLOR:
        return { ...state, color: action.payload }
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
        if (px.step <= state.step && // made before current step
            px.step + ttl > state.step) { // not older than ttl
            ctx.fillStyle = px.color
            ctx.fillRect(
                1 + px.x * resolution, 1 + px.y * resolution,
                resolution - 2, resolution - 2)
        }
    }
    $slider.value = state.step
    if (state.mode === PLAY) {
        window.setTimeout(nextTick, frameRateMs)
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
