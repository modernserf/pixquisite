import React from "react";
import h from "react-hyperscript";
import { connect } from "../../store";
import { Grid } from "../Grid";

const gridContainer = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

const GridController = connect(["grid"], {})(({ grid }) => h(Grid, grid));

export const CompleteGame = connect(["route"], ["load", "reset"])(
    class CompleteGame extends React.Component {
        componentWillMount() {
            const { route: { path: [, gameID] }, load } = this.props;
            load(gameID);
        }
        render() {
            const { reset } = this.props;
            return h("div", { style: gridContainer }, [
                h(GridController),
                h("p", ["You can share this link"]),
                h("button", { type: "button", onClick: reset }, ["Play Again"])
            ]);
        }
    }
);
