'use strict';

import DummyTapHandler from '@tests/e2e/.ancillary/fixtures/DummyTapHandler.js';
import TapDetector from '@src/ts/TapDetector.js';

const handler = new DummyTapHandler();
new TapDetector(document, 'abbr', handler); //NOSONAR

console.log('dummy tap handler initialization...');

// Expose to check in tests
(window as any).__ABBR_TAP_HANDLER__ = handler;
