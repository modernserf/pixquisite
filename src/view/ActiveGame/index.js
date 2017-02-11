import React from "react";
import { connect } from "../../store";
import { GridWithHandlers } from "../Grid";
import { Palette } from "../Palette";
import { env, playModes } from "../../constants";
import { touchClick } from "../../util/touch-click";

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

const GridController = connect(["grid"], ["draw"])(({ grid, draw }) => (
    <GridWithHandlers {...grid} draw={draw} />
));

const PaletteController = connect(["transients"], ["setColor"])((
    { transients: { color, colorStep }, setColor }
) => <Palette color={color} colorStep={colorStep} setColor={setColor} />);

const PlayToggle = connect(["transients"], [
    "play",
    "step"
])(function PlayToggle({ transients: { mode }, play, step }) {
    const button = mode === playModes.play
        ? <button type="button" {...touchClick(step)}>Step</button>
        : <button type="button" {...touchClick(play)}>Play</button>;
    return <div>{button}</div>;
});

const Scrubber = connect(["transients"], ["seek"])(function Scrubber(
    { transients: { step }, seek }
) {
    return (
        <div style={scrubber}>
            <input
                type="range"
                min={0}
                max={maxSteps - 1}
                value={step}
                onChange={e => seek(Number(e.target.value))}
            />
        </div>
    );
});

function Transport() {
    return (
        <div style={transport}>
            <PlayToggle />
            <Scrubber />
        </div>
    );
}

const Rounds = connect([], ["done"])(function Rounds(
    { done }
) {
    return (
        <div>
            <button onClick={done}>Done</button>
        </div>
    );
});

const SpeedScrubber = connect(["transients"], [
    "setSpeed"
])(function SpeedScrubber({ transients: { decay }, setSpeed }) {
    return (
        <div style={scrubber}>
            <input
                type="range"
                min={0}
                max={maxDecay}
                value={decay}
                onChange={e => {
                    e.preventDefault();
                    setSpeed(Number(e.target.value));
                }}
            />
            <div style={scrubberLabels}>
                <span>fast</span>
                <span>slow</span>
            </div>
        </div>
    );
});

// TODO: should this reset on mount?
export function ActiveGame() {
    return (
        <div>
            <div style={gridWrap}>
                <GridController />
                <PaletteController />
            </div>
            <div>
                <Transport />
                <SpeedScrubber />
                <Rounds />
            </div>
        </div>
    );
}
