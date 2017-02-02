import React from "react";
import { connect } from "../../store";
import { Grid } from "../Grid";

const gridContainer = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

// selectT(state).colorStep, selectDraw, (colorStep, drawState) => Object.assign({}, drawState, { colorStep }))

const GridController = connect(["grid"], {})(({ grid }) => <Grid {...grid} />);

export const CompleteGame = connect(["route"], ["load", "reset"])(
    class CompleteGame extends React.Component {
        componentWillMount() {
            const { route: { path: [, gameID] }, load } = this.props;
            // TODO: pure selector
            load(gameID);
        }
        render() {
            const { reset } = this.props;
            return (
                <div style={gridContainer}>
                    <GridController />
                    <p>You can share this link.</p>
                    <button type="button" onClick={() => reset()}>
                        Play Again
                    </button>
                </div>
            );
        }
    }
);
