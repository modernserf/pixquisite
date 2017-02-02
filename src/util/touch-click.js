const hasTouchEvents = "ontouchstart" in document.documentElement;

export const touchClick = fn =>
    hasTouchEvents ? { onTouchEnd: fn } : { onMouseDown: fn };
