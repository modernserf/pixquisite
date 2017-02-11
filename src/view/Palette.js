const { h } = require("preact");
import { touchClick } from "../util/touch-click";
import { colorMap } from "../constants";

const palette = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
};

const paletteButton = {
    width: "100%",
    maxWidth: 44,
    height: 44,
    borderRadius: 0,
    padding: 0,
    outline: "none"
};

const fillStyle = (a, [r, g, b]) => `rgba(${r},${g},${b},${a})`;
const m = (a, b) => Object.assign({}, a, b);
const colorList = Object
    .keys(colorMap)
    .map(id => ({ id, value: colorMap[id] }));

export function Palette({ color, colorStep, setColor }) {
    const colorCells = colorList.map(({ id, value }) => h(
        "button",
        m(
            {
                key: id,
                type: "button",
                style: m(paletteButton, {
                    backgroundColor: fillStyle(
                        1,
                        value[colorStep % value.length]
                    ),
                    border: id === color ? "4px solid black" : "none"
                })
            },
            touchClick(() => setColor(id))
        )
    ));

    return h("div", { style: palette }, [colorCells]);
}
