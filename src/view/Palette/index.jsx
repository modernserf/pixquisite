import React from "react"
import { touchClick } from "../../util/touch-click"
import { colorMap } from "../../constants"

const palette = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
}

const paletteButton = {
    width: "100%",
    maxWidth: 44,
    height: 44,
    borderRadius: 0,
    padding: 0,
    outline: "none",
}

const fillStyle = (a, [r, g, b]) => `rgba(${r},${g},${b},${a})`

const colorList = Object.keys(colorMap)
    .map((id) => ({ id, value: colorMap[id] }))

export function Palette ({color, colorStep, setColor}) {
    const colorCells = colorList.map(({id, value}) =>
        <button key={id}
            type="button"
            style={{
                ...paletteButton,
                backgroundColor: fillStyle(1, value[colorStep % value.length]),
                border: id === color ? "4px solid black" : "none",
            }}
            {...touchClick(() => setColor(id))}/>)

    return (
        <div style={palette}>{colorCells}</div>
    )
}
