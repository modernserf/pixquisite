import React from "react"
import { touchClick } from "util/touch-click"
import S from "./style.css"

const fillStyle = (a, [r, g, b]) => `rgba(${r},${g},${b},${a})`

export function Palette ({color, getColor, colors, setColor}) {
    const colorCells = colors.map((c) =>
        <button key={c}
            type="button"
            className={S.palette_button}
            style={{
                backgroundColor: fillStyle(1, getColor(c)),
                border: c === color ? "4px solid black" : "none",
            }}
            {...touchClick(() => setColor(c))}/>)

    return (
        <div className={S.palette}>{colorCells}</div>
    )
}
