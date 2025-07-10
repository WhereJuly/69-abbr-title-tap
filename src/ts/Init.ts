'use strict';

import AbbrTapHandler from '@src/ts/core/AbbrTapHandler.js';
import TapDetector from '@src/ts/core/TapDetector.js';

/**
 * Initializes tap-to-show tooltip behavior for `<abbr>` elements only once (Singleton).
 * Automatically attaches a TapDetector to the document on first instantiation.
 * 
 * @usedBy {@link .delivery/scripts/build/browser-entry-point.ts}
 */
export class Init {

    /** @type {Init} Singleton instance reference */
    public static instance: Init; // NOSONAR

    constructor() {
        if (Init.instance) {
            return;
        }

        new TapDetector(document, 'abbr', new AbbrTapHandler()); // NOSONAR

        Init.instance = this;
    }

}
