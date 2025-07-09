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

export async function beforeTest(page: Page, testInfo: TestInfo, initScriptName: string): Promise<void> {
    // Set up basic page DOM
    const html = htmlContent('page.html', testInfo);
    await page.setContent(html, { waitUntil: 'load' });

    // WARNING: Run `npm run build:test` after update and before using it here 
    await page.addScriptTag({ path: `.delivery/.builds/test/${initScriptName}`, type: 'module' });
    await page.addStyleTag({ path: '.delivery/.builds/test/styles.css' });

    // Forward all console messages from page to Node.js console
    page.on('console', msg => { console.log(`PAGE LOG [${msg.type()}]: ${msg.text()}`); });
}