'use strict';

import { ATapHandler } from '@src/ts/ATapHandler.js';

type TOuterTapTrapElement = Document | HTMLElement;

export default class TapDetector {

    private readonly outerTapTrapElement: TOuterTapTrapElement;
    private readonly selector: string;
    private readonly tapHandler: ATapHandler;

    private tapTarget: EventTarget | null = null;
    private touchMoved = false;

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

    private handleTouchStart(event: TouchEvent) {
        const target = (event.target as HTMLElement).closest(this.selector);
        this.tapTarget = target;
        this.touchMoved = false;
    };

    private handleTouchMove() {
        this.touchMoved = true;
    };

    private handleTouchEnd(event: TouchEvent) {
        const target = (event.target as HTMLElement).closest(this.selector);
        if (this.touchMoved || !target || target !== this.tapTarget) { return; }

        const inProcessTarget = this.tapTarget as HTMLElement;
        // INFO: To avoid operations on the same element if `touchstart` happens within `tapHandler` 
        this.tapTarget = null;

        this.tapHandler.handle(inProcessTarget);
    };

    destroy() {
        this.outerTapTrapElement.removeEventListener('touchstart', this.handleTouchStart as EventListener);
        this.outerTapTrapElement.removeEventListener('touchmove', this.handleTouchMove);
        this.outerTapTrapElement.removeEventListener('touchend', this.handleTouchEnd as EventListener);
    }

}
