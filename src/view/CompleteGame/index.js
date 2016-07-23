import React from "react"
import { connect } from "react-redux"
import { createSelector } from "reselect"
import { schema } from "../../constants"
import { select as selectT } from "../../store/transient"
import { select as selectDraw } from "../../store/draw"
import { Grid } from "../Grid"

const { load, reset } = schema.actionCreators

const gridContainer = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}

const GridController = connect(createSelector(
(state) => selectT(state).colorStep,
selectDraw,
(colorStep, drawState) => ({...drawState, colorStep})))(Grid)


export const CompleteGame = connect(() => ({}), {load, reset})(
class CompleteGame extends React.Component {
    componentWillMount () {
        console.log("this is OK")
        const { params: { gameID }, load } = this.props
        load(gameID)
    }
    render () {
        const { reset } = this.props
        return (
            <div style={gridContainer}>
                <GridController/>
                <p>You can share this link.</p>
                <button type="button"
                    onClick={() => reset()}>Play Again</button>
            </div>
        )
    }
})
