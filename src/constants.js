import createEnum from "./util/enum";

export const localStorageKey = "pixquisite-v5";

export const playModes = createEnum(["play", "step"]);

export const selectors = createEnum(["play", "draw", "route"]);

export const env = {
    width: 16,
    height: 16,
    maxDecay: 4,
    maxSteps: 32,
    resolution: 24, // css px per cell
    frameRate: 12
};

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
    lavender: [255, 127, 255]
};

// map color name to cycle
// most colors are single-item cycle
export const colorMap = createEnum(
    ["black", "white", "red", "blue", "green", "orange", "purple"],
    key => [c[key]]
);

colorMap.rainbow = [c.pink, c.orange, c.yellow, c.lime, c.cyan, c.lavender];
