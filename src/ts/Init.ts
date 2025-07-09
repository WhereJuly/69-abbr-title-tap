'use strict';

import AbbrTapHandler from '@src/ts/core/AbbrTapHandler.js';
import TapDetector from '@src/ts/core/TapDetector.js';

export class Init {

    public static instance: Init; // NOSONAR

    constructor() {
        if (Init.instance) {
            return;
        }

        new TapDetector(document, 'abbr', new AbbrTapHandler()); // NOSONAR

        Init.instance = this;
    }

}
