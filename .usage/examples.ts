'use strict';

import 'abbr-title-tap/styles.css';

import { AbbrTapHandler, TapDetector, Init } from 'abbr-title-tap';

// This will initialize the package code as a singleton
new Init() // NOSONAR

// This is the manual initialization.
new TapDetector(document, 'abbr', new AbbrTapHandler()); // NOSONAR