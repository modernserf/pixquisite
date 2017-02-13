import { h } from "preact";
import { connect } from "../store/index";
import { Grid } from "./Grid";

const gridContainer = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

const GridController = connect(["grid"], {})(({ grid }) => h(Grid, grid));

export const CompleteGame = () =>
    h("div", { style: gridContainer }, [h(GridController)]);
