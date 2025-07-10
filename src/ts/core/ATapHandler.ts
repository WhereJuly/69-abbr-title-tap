'use strict';

/**
 * Abstract base class for implementing custom tap event handling.
 * Provides the foundation for concrete tap handlers to process element taps.
 */
export abstract class ATapHandler {

    /**
     * The currently active element being handled.
     */
    protected el: HTMLElement | Document | null;

    constructor() {
        this.el = null;
    }

    /**
     * Abstract method that must be implemented to handle tap events.
     */
    abstract handle(el: HTMLElement): void;

}
