'use strict';

import { ATapHandler } from '@src/ts/ATapHandler.js';

/**
 * The class to test the TapDetector class with expected side effects.
 * 
 * @see {@link src\ts\TapDetector.ts}
 */
export default class DummyTapHandler extends ATapHandler {

    private _tagName: string | null;

    constructor() {
        super();

        this._tagName = null;
    }

    public handle(el: HTMLElement): void {
        this.el = el;

        const isDocument = this.el instanceof Document;
        this._tagName = isDocument ? 'document' : el.tagName.toLowerCase();
    }

    public get tagName(): string | null {
        return this._tagName;
    }

}