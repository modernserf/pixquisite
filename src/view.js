import {
    ttl, width, height, resolution, localStorageKey,
    PLAY, STEP, PARK, DRAW, SEEK, SET_COLOR, RESET,
} from "constants"
import { load, save, tick } from "actions"

export function mount (dispatch) {
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

    // hydrate state
    var savedData = window.localStorage.getItem(localStorageKey)
    if (savedData) {
        $storage.value = savedData
        dispatch(load(savedData))
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
        dispatch(tick())
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
        dispatch(load($storage.value))
    })

    $save.addEventListener("click", (e) => {
        dispatch(save($storage))
    })

    $clear.addEventListener("click", (e) => {
        window.localStorage.removeItem(localStorageKey)
        $storage.value = ""
        dispatch({type: RESET})
    })

    var ctx = $grid.getContext("2d")

    return { ctx, $slider }
}

export function render (state, {ctx, $slider}) {
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
}
