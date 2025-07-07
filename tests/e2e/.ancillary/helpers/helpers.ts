'use strict';

import fs from 'fs';
import { Locator, Page, TestInfo } from '@playwright/test';

export const htmlContent = (fileName: string, testInfo: TestInfo) => {
    const root = testInfo.config.rootDir;
    const fixture = `${root}/../.ancillary/fixtures/${fileName}`;

    return fs.readFileSync(fixture, 'utf8');
};

export async function hasVisibleAfter(locator: Locator): Promise<boolean> {
    return await locator.evaluate(el => {
        return getComputedStyle(el, '::after')?.display !== 'none';
    });
};


export async function retrieveTagName(page: Page): Promise<string | null> {
    return await page.evaluate(() => {
        return window.__ABBR_TAP_HANDLER__.tagName;
    });
};