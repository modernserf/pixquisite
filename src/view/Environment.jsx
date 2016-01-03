import React from "react"
import { connect } from "react-redux"

import { patch } from "actions"

function EnvValue ({id, state}) {
    return (
        <div>
            <label>{id}</label>
            <input type="number"
                value={state[id]}
                onChange={(e) => state.patch({
                    [id]: Number(e.target.value),
                })}/>
        </div>
    )
}

export const Environment = connect((s) => s, { patch })(
function Environment (state) {
    const vals = ["ttl", "width", "height", "maxSteps", "resolution", "frameRate"]
        .map((key) => <EnvValue key={key} id={key} state={state}/>)
    return (
        <div>
            {vals}
        </div>
    )
})
