'use strict';

/**
 * Abstract class for handling tap events on elements.
 */
export abstract class ATapHandler {

    protected el: HTMLElement | null;

    constructor() {
        this.el = null;
    }

    abstract handle(el: HTMLElement): void;

}
