import React from "react"
import { connect } from "react-redux"
import { createSelector } from "reselect"
import S from "./style.css"
import { schema } from "../../constants"
import { select as selectT } from "../../store/transient"
import { select as selectDraw } from "../../store/draw"
import { Grid } from "../Grid"

const { load, reset } = schema.actionCreators

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
                    onClick={() => reset()}>Play Again</button>
            </div>
        )
    }
})

const GridController = connect(createSelector(
(state) => selectT(state).colorStep,
selectDraw,
(colorStep, drawState) => ({...drawState, colorStep})))(Grid)
