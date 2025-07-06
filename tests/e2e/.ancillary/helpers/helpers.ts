'use strict';

import fs from 'fs';
import { TestInfo } from '@playwright/test';

export const htmlContent = (fileName: string, testInfo: TestInfo) => {
    const root = testInfo.config.rootDir;
    const fixture = `${root}/../.ancillary/fixtures/${fileName}`;

    return fs.readFileSync(fixture, 'utf8');
};