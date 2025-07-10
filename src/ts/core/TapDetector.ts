'use strict';

import { ATapHandler } from '@src/ts/core/ATapHandler.js';

type TOuterTapTrapElement = Document | HTMLElement;

/**
 * Detects **tap** (`touchstart` followed by `touchend`) gestures on specified elements 
 * and delegates handling to a tap handler.
 * 
 * Manages touch event listeners and prevents accidental taps during touch movement.
 */
export default class TapDetector {

    private readonly outerTapTrapElement: TOuterTapTrapElement;
    private readonly selector: string;
    private readonly tapHandler: ATapHandler;

    private tapTarget: EventTarget | null = null;
    private touchMoved = false;

    /**
     * @param {Document|HTMLElement} outerTapTrapElement The container element to listen for touch events
     * @param {string} selector A valid CSS selector for elements that should react on taps
     * @param {ATapHandler} tapHandler Handler instance to process valid taps
     */
    constructor(outerTapTrapElement: TOuterTapTrapElement, selector: string, tapHandler: ATapHandler) {
        this.outerTapTrapElement = outerTapTrapElement;
        this.selector = selector;
        this.tapHandler = tapHandler;

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.outerTapTrapElement.addEventListener('touchstart', this.handleTouchStart as EventListener, { passive: true });
        this.outerTapTrapElement.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        this.outerTapTrapElement.addEventListener('touchend', this.handleTouchEnd as EventListener);
    }

    /**
     * Handles touch start events, capturing the initial tap target.
     * NB: If `touchstart` happens outside `this.selector` element, `this.tapTarget` gets null value.
     * 
     * @param {TouchEvent} event The touchstart event
     */
    private handleTouchStart(event: TouchEvent) {
        const target = (event.target as HTMLElement).closest(this.selector);
        this.tapTarget = target;
        this.touchMoved = false;
    };

    /**
     * Flags touch movement to prevent reacting to `touchstart` followed by `touchmove`.
     */
    private handleTouchMove() {
        this.touchMoved = true;
    };

    /**
     * Processes valid tap gestures (without movement) by delegating to the tap handler.
     * Uses document as target if touch started outside specified elements.
     * 
     * @param {TouchEvent} _event - The touchend event
     */
    private handleTouchEnd(_event: TouchEvent) {
        // NB: If `touchstart` was outside `this.selector` element, `this.tapTarget` is null.
        // Then we set the tap handler target to `document` element.
        const target = this.tapTarget ?? document;

        if (this.touchMoved || !target) { return; }

        const inProcessTarget = target as HTMLElement;

        // INFO: To avoid operations on the same element if another `touchstart` happens within `tapHandler` 
        this.tapTarget = null;

        this.tapHandler.handle(inProcessTarget);
    };

    /**
     * Cleans up event listeners when detector is no longer needed.
     */
    destroy() {
        this.outerTapTrapElement.removeEventListener('touchstart', this.handleTouchStart as EventListener);
        this.outerTapTrapElement.removeEventListener('touchmove', this.handleTouchMove);
        this.outerTapTrapElement.removeEventListener('touchend', this.handleTouchEnd as EventListener);
    }

}
