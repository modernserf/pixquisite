import React from "react";
import h from "react-hyperscript";
import { env, colorMap } from "../../constants";
const { width, height, resolution } = env;

const canvasStyle = {
    border: "1px solid black",
    cursor: "crosshair",
    backgroundColor: "white"
};

export class Grid extends React.Component {
    componentWillUpdate(nextProps) {
        drawCanvas(this._ctx, nextProps);
    }
    setContext(el) {
        if (!el) {
            return;
        }
        this._ctx = el.getContext("2d");
    }
    render() {
        return h("canvas", {
            ref: el => this.setContext(el),
            style: canvasStyle,
            width: width * resolution,
            height: height * resolution
        });
    }
}

export class GridWithHandlers extends React.Component {
    constructor() {
        super();
        this.state = {
            mousedown: false,
            position: { top: 0, left: 0 }
        };
        this.setClientRect = this.setClientRect.bind(this);
    }
    componentDidMount() {
        window.addEventListener("resize", this.setClientRect);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.setClientRect);
    }
    setClientRect() {
        this.setState({ position: this._el.getBoundingClientRect() });
    }
    onDrawStart(e) {
        e.preventDefault();
        this.onDraw(e);
        this.setState({ mousedown: true });
    }
    onDrawEnd(e) {
        e.preventDefault();
        this.setState({ mousedown: false });
    }
    onDrawMove(e) {
        e.preventDefault();
        if (!this.state.mousedown) {
            return;
        }
        this.onDraw(e);
    }
    onDraw(e) {
        const { draw } = this.props;
        const { top, left } = this.state.position;

        const event = e.nativeEvent.targetTouches
            ? e.nativeEvent.targetTouches[0]
            : e;

        draw(
            Math.floor((event.clientX - left) / resolution),
            Math.floor((event.clientY - top) / resolution)
        );
    }
    render() {
        const handlers = {
            onMouseDown: e => this.onDrawStart(e),
            onMouseUp: e => this.onDrawEnd(e),
            onMouseOut: e => this.onDrawEnd(e),
            onMouseMove: e => this.onDrawMove(e),
            onTouchStart: e => this.onDrawStart(e),
            onTouchEnd: e => this.onDrawEnd(e),
            onTouchMove: e => this.onDrawMove(e),
            onTouchCancel: e => this.onDrawEnd(e),
            ref: el => {
                this._el = el;
            }
        };

        return h("div", handlers, [h(Grid, this.props)]);
    }
}

const fillStyle = (a, [r, g, b]) => `rgba(${r},${g},${b},${a})`;

function drawPixel(ctx, x, y, px, colorStep = 0, alpha = 1) {
    const color = colorMap[px.color];
    ctx.fillStyle = fillStyle(alpha, color[colorStep % color.length]);
    // draw with 1px padding
    ctx.fillRect(
        1 + x * resolution,
        1 + y * resolution,
        resolution - 2,
        resolution - 2
    );
}

function clearCanvas(ctx) {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(0, 0, width * resolution, height * resolution);
}

function drawCanvas(ctx, { frames, currentIndex, colorStep }) {
    clearCanvas(ctx);
    const frame = frames[currentIndex];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const s = y * width + x;
            if (frame && frame[s]) {
                drawPixel(ctx, x, y, frame[s], colorStep);
            }
        }
    }
}
