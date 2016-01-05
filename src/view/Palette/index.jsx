import React from "react"
import { colors } from "constants"
import { touchClick } from "util/touch-click"
import S from "./style.css"

const fillStyle = (a, [r, g, b]) => `rgba(${r},${g},${b},${a})`

export function Palette ({color, setColor}) {
    const colorCells = colors.map((c) =>
        <button key={c}
            type="button"
            className={S.palette_button}
            style={{
                backgroundColor: fillStyle(1, c),
                border: c === color ? "4px solid black" : "none",
            }}
            {...touchClick(() => setColor(c))}/>)

    return (
        <div className={S.palette}>{colorCells}</div>
    )
}
