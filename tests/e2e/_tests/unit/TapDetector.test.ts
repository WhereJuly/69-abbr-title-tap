'use strict';

import { test, expect, TestInfo, PlaywrightTestArgs } from '@playwright/test';

import { htmlContent } from '@tests/e2e/.ancillary/helpers/helpers.js';

test.only('Basic TapDetector test', async ({ page }: PlaywrightTestArgs, testInfo: TestInfo) => {
    page.on('console', msg => {
        // Forward all console messages from page to Node.js console
        console.log(`PAGE LOG [${msg.type()}]: ${msg.text()}`);
    });


    // Set up basic page DOM
    const html = htmlContent('page.html', testInfo);
    await page.setContent(html, { waitUntil: 'load' });

    // WARNING: Run `npm run build:test` after update and before using it here 
    await page.addScriptTag({ path: '.delivery/.builds/test/initialization.js', type: 'module' });

    expect(page).toBeTruthy();

    const abbr = page.locator('abbr').first();
    abbr.waitFor();

    await abbr?.dispatchEvent('touchstart');
    await abbr?.dispatchEvent('touchend');

    // Verify handler ran
    const isOn = await page.evaluate(() => window.__ABBR_TAP_HANDLER__.isOn);
    expect(isOn).toBe(true);
});