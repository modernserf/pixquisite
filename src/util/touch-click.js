const hasTouchEvents = "ontouchstart" in window.document.documentElement;

export const touchClick = fn =>
    hasTouchEvents ? { onTouchEnd: fn } : { onMouseDown: fn };
