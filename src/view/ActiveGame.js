import { h } from "preact";
import { connect } from "../store/index";
import { GridWithHandlers } from "./Grid";
import { Palette } from "./Palette";
import { env, playModes } from "../constants";
import { touchClick } from "../util/touch-click";

const row = {
    display: "flex",
    flexDirection: "row"
};

const gridWrap = row;
const transport = row;
const scrubber = {
    flexGrow: 1,
    maxWidth: 400,
    margin: "0 24px"
};

const scrubberLabels = Object.assign({}, row, {
    justifyContent: "space-between"
});

const { maxDecay, maxSteps } = env;

const m = (a, b) => Object.assign({}, a, b);
const div = (props, children) =>
    children ? h("div", props, children) : h("div", {}, props);
const span = children => h("span", {}, children);
const button = (props, children) =>
    h("button", m({ type: "button" }, props), children);
const range = props => h("input", m(props, {
        type: "range",
        onChange: e => props.onChange(Number(e.target.value))
    }));

const GridController = connect(["grid"], ["draw"])(({ grid, draw }) =>
    h(GridWithHandlers, m(grid, { draw })));

const PaletteController = connect(["transients"], ["setColor"])((
    { transients: { color, colorStep }, setColor }
) =>
    h(Palette, { color, colorStep, setColor }));

const PlayToggle = connect(["transients"], ["play", "step"])((
    { transients: { mode }, play, step }
) => {
    const isPlay = mode === playModes.play;
    return div([
        button(touchClick(isPlay ? step : play), [isPlay ? "Step" : "Play"])
    ]);
});

const Scrubber = connect(["transients"], ["seek"])((
    { transients: { step }, seek }
) =>
    div({ style: scrubber }, [range({
            min: 0,
            max: maxSteps - 1,
            value: step,
            onChange: seek
        })]));

const Transport = () => div({ style: transport }, [h(PlayToggle), h(Scrubber)]);

const Rounds = connect([], ["done"])(({ done }) =>
    div([button({ onClick: done }, ["Done"])]));

const SpeedScrubber = connect(["transients"], ["setSpeed"])((
    { transients: { decay }, setSpeed }
) =>
    div({ style: scrubber }, [range({
            min: 0,
            max: maxDecay,
            value: decay,
            onChange: setSpeed
        }), div({ style: scrubberLabels }, [span(["fast"]), span(["slow"])])]));

export const ActiveGame = () =>
    div([
        div({ style: gridWrap }, [h(GridController), h(PaletteController)]),
        div([h(Transport), h(SpeedScrubber), h(Rounds)])
    ]);
