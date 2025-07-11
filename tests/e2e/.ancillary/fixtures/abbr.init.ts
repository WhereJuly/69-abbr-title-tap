'use strict';

import AbbrTapHandler from '@src/ts/core/AbbrTapHandler.js';
import TapDetector from '@src/ts/core/TapDetector.js';

const handler = new AbbrTapHandler();
new TapDetector(document, 'abbr', handler); //NOSONAR

console.log('actual abbr tap handler initialization...');
