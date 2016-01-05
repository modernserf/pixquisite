import React from "react"
import ReactDOM from "react-dom"

import S from "./style.css"

export class Grid extends React.Component {
    componentWillUpdate (nextProps) {
        drawCanvas(this._ctx, nextProps)
    }
    setContext (el) {
        if (!el) { return }
        this._ctx = el.getContext("2d")
    }
    render () {
        const { width, height, resolution } = this.props

        return (
            <canvas ref={(el) => this.setContext(el)}
                className={S.canvas}
                width={width * resolution}
                height={height * resolution}/>
        )
    }
}

export class GridWithHandlers extends React.Component {
    constructor () {
        super()
        this.state = {
            mousedown: false,
            position: { top: 0, left: 0 },
        }
        this.setClientRect = ::this.setClientRect
    }
    componentDidMount () {
        window.addEventListener("resize", this.setClientRect)
    }
    componentWillUnmount () {
        window.removeEventListener("resize", this.setClientRect)
    }
    setClientRect () {
        const el = ReactDOM.findDOMNode(this)
        this.setState({position: el.getBoundingClientRect()})
    }
    onDrawStart (e) {
        e.preventDefault()
        this.onDraw(e)
        this.setState({mousedown: true})
    }
    onDrawEnd (e) {
        e.preventDefault()
        this.setState({mousedown: false})
    }
    onDrawMove (e) {
        e.preventDefault()
        if (!this.state.mousedown) { return }
        this.onDraw(e)
    }
    onDraw (e) {
        const { draw, resolution } = this.props
        const { top, left } = this.state.position

        const event = e.nativeEvent.targetTouches
            ? e.nativeEvent.targetTouches[0]
            : e

        draw({
            x: Math.floor((event.clientX - left) / resolution),
            y: Math.floor((event.clientY - top) / resolution),
        })
    }
    render () {
        const handlers = {
            onMouseDown: (e) => this.onDrawStart(e),
            onMouseUp: (e) => this.onDrawEnd(e),
            onMouseOut: (e) => this.onDrawEnd(e),
            onMouseMove: (e) => this.onDrawMove(e),
            onTouchStart: (e) => this.onDrawStart(e),
            onTouchEnd: (e) => this.onDrawEnd(e),
            onTouchMove: (e) => this.onDrawMove(e),
            onTouchCancel: (e) => this.onDrawEnd(e),
        }

        return (
            <div {...handlers}>
                <Grid {...this.props}/>
            </div>
        )
    }
}

const mod = (a, b) => ((a % b) + b) % b

const fillStyle = (a, [r, g, b]) => `rgba(${r},${g},${b},${a})`

function drawPixel (ctx, px, resolution) {
    ctx.fillStyle = fillStyle(1, px.color)
    // draw with 1px padding
    ctx.fillRect(
        1 + px.x * resolution,
        1 + px.y * resolution,
        resolution - 2,
        resolution - 2)
}

function clearCanvas (ctx, {width, height, resolution}) {
    ctx.fillStyle = "rgba(255,255,255,0.5)"
    ctx.fillRect(0, 0, width * resolution, height * resolution)
}

function visibleCurrent (px, {step, maxSteps}) {
    return px.step <= step && px.step + px.ttl > step
}

function visibleTrail (px, params) {
    return visibleCurrent({step: px.step - params.maxSteps, ttl: px.ttl}, params)
}

function drawCanvas (ctx, props) {
    clearCanvas(ctx, props)
    const { round, complete, pixels, resolution } = props
    // show trail of previous round
    if (round > 0 || complete) {
        const lastRound = mod(round - 1, pixels.length)
        for (let i = 0, ln = pixels[lastRound].length; i < ln; i++) {
            const px = pixels[lastRound][i]
            if (visibleTrail(px, props)) {
                drawPixel(ctx, px, resolution)
            }
        }
    }

    for (let i = 0, ln = pixels[round].length; i < ln; i++) {
        const px = pixels[round][i]
        // show active px
        if (visibleCurrent(px, props) ||
            (visibleTrail(px, props) && !complete)) {
            drawPixel(ctx, px, resolution)
        }
    }
}
