import React from "react"
import { connect } from "react-redux"

import S from "./style.css"
import { load, reset } from "actions"
import { selectCompleted } from "store"
import { Grid } from "view/Grid"

export const CompleteGame = connect(() => ({}), {load, reset})(
class CompleteGame extends React.Component {
    componentWillMount () {
        const { params: { gameID }, load } = this.props
        load(gameID)
    }
    render () {
        const { reset } = this.props
        return (
            <div className={S.grid_container}>
                <GridController/>
                <p>You can share this link.</p>
                <button type="button"
                    onClick={reset}>Play Again</button>
            </div>
        )
    }
})

const GridController = connect(selectCompleted)(Grid)
