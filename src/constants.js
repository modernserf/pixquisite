// constants
export const localStorageKey = "pixquisite-v5"

// gameplay
export const PLAY_SELECTOR = "play/SELECTOR"
export const TICK = "play/TICK"
export const PLAY = "play/PLAY"
export const STEP = "play/STEP"
export const DRAW = "play/DRAW"
export const DRAW_REQUEST = "play/DRAW_REQUEST"
export const SEEK = "play/SEEK"
export const SET_COLOR = "play/SET_COLOR"
export const SET_SPEED = "play/SET_SPEED"
export const NEXT_ROUND = "play/NEXT_ROUND"
export const DONE = "play/DONE"
export const DONE_REQUEST = "play/DONE_REQUEST"
export const RESET = "play/RESET"
export const LOAD = "play/LOAD"
export const LOAD_REQUEST = "play/LOAD_REQUEST"
export const SET_RAINBOW = "play/SET_RAINBOW"

export const ENV_SELECTOR = "env/SELECTOR"
export const PATCH = "env/PATCH"

export const ROUTE_SELECTOR = "route/SELECTOR"

const c = {
    black: [20, 20, 20],
    white: [255, 255, 255],
    red: [255, 0, 0],
    yellow: [255, 255, 0],
    blue: [0, 0, 255],
    green: [0, 127, 0],
    orange: [255, 127, 0],
    pink: [255, 127, 127],
    purple: [127, 0, 127],
    cyan: [127, 127, 255],
    lime: [0, 255, 0],
    lavender: [255, 127, 255],
}

const basePallete = [
    "black", "white", "red", "blue", "green", "orange", "purple",
]

// map color name to cycle
// most colors are single-item cycle
export const colorMap = basePallete.reduce((m, key) => {
    m[key] = [c[key]]
    return m
}, {})

colorMap.rainbow = [
    c.pink, c.orange, c.yellow, c.lime, c.cyan, c.lavender,
]
