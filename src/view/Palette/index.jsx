import React from "react"
import { touchClick } from "../../util/touch-click"
import S from "./style.css"
import { colorMap } from "../../constants"

const fillStyle = (a, [r, g, b]) => `rgba(${r},${g},${b},${a})`

const colorList = Object.keys(colorMap)
    .map((id) => ({ id, value: colorMap[id] }))

export function Palette ({color, colorStep, setColor}) {
    const colorCells = colorList.map(({id, value}) =>
        <button key={id}
            type="button"
            className={S.palette_button}
            style={{
                backgroundColor: fillStyle(1, value[colorStep % value.length]),
                border: id === color ? "4px solid black" : "none",
            }}
            {...touchClick(() => setColor(id))}/>)

    return (
        <div className={S.palette}>{colorCells}</div>
    )
}
