'use strict';

import DummyTapHandler from '@tests/e2e/.ancillary/fixtures/DummyTapHandler.js';
import TapDetector from '@src/ts/TapDetector.js';

const handler = new DummyTapHandler();
const detector = new TapDetector(document, 'abbr', handler);

console.log('initialization...');

// Optionally expose for testing
(window as any).__ABBR_TAP_HANDLER__ = handler;
(window as any).__TAP_DETECTOR__ = detector;
