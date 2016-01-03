import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { draw } from "actions"

const mod = (a, b) => ((a % b) + b) % b

function drawPixel (ctx, px, resolution) {
    ctx.fillStyle = px.color
    // draw with 1px padding
    ctx.fillRect(
        1 + px.x * resolution,
        1 + px.y * resolution,
        resolution - 2,
        resolution - 2)
}

function clearCanvas (ctx, {width, height, resolution}) {
    ctx.clearRect(0, 0, width * resolution, height * resolution)
}

function drawCanvas (ctx, props) {
    clearCanvas(ctx, props)
    const { step, round, complete, pixels, maxSteps, ttl, resolution } = props
    // show last px of prev round
    if (round > 0 || complete) {
        const lastRound = mod(round - 1, pixels.length)
        for (let i = 0, ln = pixels[lastRound].length; i < ln; i++) {
            const px = pixels[lastRound][i]
            const end = px.step + ttl
            const showStep = end > maxSteps && end - maxSteps > step
            if (showStep) { drawPixel(ctx, px, resolution) }
        }
    }

    for (let i = 0, ln = pixels[round].length; i < ln; i++) {
        const px = pixels[round][i]
        const p = complete ? (step - px.step) : mod(step - px.step, maxSteps)
        const showStep = p >= 0 && ttl > p

        if (showStep) { drawPixel(ctx, px, resolution) }
    }
}

export const Grid = connect((state) => state, { draw })(
class Grid extends React.Component {
    constructor () {
        super()
        this.state = {
            mousedown: false,
            position: { top: 0, left: 0 },
        }
        this.setClientRect = ::this.setClientRect
    }
    setContext (el) {
        if (!el) { return }
        this._ctx = el.getContext("2d")
    }
    componentDidMount () {
        window.addEventListener("resize", this.setClientRect)
    }
    componentWillUnmount () {
        window.removeEventListener("resize", this.setClientRect)
    }
    componentWillUpdate (nextProps) {
        drawCanvas(this._ctx, nextProps)
    }
    setClientRect () {
        const el = ReactDOM.findDOMNode(this)
        this.setState({position: el.getBoundingClientRect()})
    }
    onMouseDown (e) {
        e.preventDefault()
        this.onDraw(e)
        this.setState({mousedown: true})
    }
    onMouseEnd (e) {
        e.preventDefault()
        this.setState({mousedown: false})
    }
    onMouseMove (e) {
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
        const { width, height, resolution, complete } = this.props

        const handlers = complete ? {} : {
            onMouseDown: (e) => this.onMouseDown(e),
            onMouseUp: (e) => this.onMouseEnd(e),
            onMouseOut: (e) => this.onMouseEnd(e),
            onMouseMove: (e) => this.onMouseMove(e),
            onTouchStart: (e) => this.onMouseDown(e),
            onTouchEnd: (e) => this.onMouseEnd(e),
            onTouchMove: (e) => this.onMouseMove(e),
            onTouchCancel: (e) => this.onMouseEnd(e),
        }

        return (
            <div>
                <canvas ref={(el) => this.setContext(el)}
                    {...handlers}
                    width={width * resolution}
                    height={height * resolution}/>
            </div>
        )
    }
})
